import { Span } from '@appsignal/javascript/dist/cjs/span';
import {
  Block,
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider';
import {
  BigNumber,
  constants,
  Contract,
  ContractInterface,
  PopulatedTransaction,
  utils,
} from 'ethers';
import { DateTime } from 'luxon';

// import config from 'config';
import {
  ApiProvider,
  CallSchema,
  IFullError,
  MultiCall,
  SingleCall,
  TCall,
  Transaction,
  TransactionStatus,
  TxDetails,
} from 'types';
import { getLocalizedError } from 'utils';
import appsignal from 'utils/appsignal';
import {
  expScale,
  MintProxyABI,
  TRANSACTION_RESULT_DATETIME,
} from 'utils/constants';
import i18n from 'utils/i18n/i18n';

type Callbacks = {
  onStart?: (tx: Transaction) => boolean | void;
  onSigned?: (tx: Transaction) => boolean | void;
  onSent?: (tx: Transaction) => boolean | void;
  onError?: (tx: Transaction) => boolean | void;
};

class TransactionService {
  public provider: ApiProvider;
  private ethPrice: BigNumber;

  private triggerCallback = (
    k: keyof Callbacks,
    callbacks: Callbacks,
    t: Transaction
  ) => {
    const callback = callbacks[k];
    if (callback) {
      return callback({ ...t });
    }
    return false;
  };

  // Calculates increased gasLimit based on method type
  private forceIncreaseGasLimit(
    contractFunctionName: string,
    currentGasLimit: BigNumber
  ): BigNumber {
    // For all borrow-related txs we force add 100k gasUsed to cover un estimated `AccrueInterest` logic
    if (contractFunctionName.toLowerCase().includes('borrow')) {
      return currentGasLimit.add(100_000);

      // For all others txs we increase gasLimit in 10% for safety reason
    } else {
      return currentGasLimit.mul(110).div(100);
    }
  }

  isSingleCall = (call: TCall): call is SingleCall => {
    return (call as SingleCall).method !== undefined;
  };

  call = async (schema: CallSchema, callbacks?: Callbacks) => {
    const results = [];
    for (let i = 0; i < schema.length; i++) {
      const isLast = i === schema.length - 1;
      const cbs = { ...callbacks };
      if (!isLast) {
        delete cbs.onSent;
      }
      const call = schema[i];
      if (this.isSingleCall(call)) {
        results.push(await this.callSingle(call, cbs));
      } else {
        results.push(await this.callMultiple(call, cbs));
      }
    }
    return results;
  };

  callSingle = async (call: SingleCall, callbacks?: Callbacks) => {
    const { method, address, abi, args, value, data } = call;
    const transaction: Transaction = { status: TransactionStatus.ready };
    await appsignal
      .wrap(
        async () => {
          try {
            transaction.status = TransactionStatus.signing;
            if (this.triggerCallback('onStart', callbacks, transaction)) return;
            const signer = this.provider.getSigner();
            let txReq;

            // Raw data transaction block
            // When we already have payload for the target tx
            if (data) {
              // FIXME: Hot fit to avoid error from LZ Bridge contract ( LayerZero: not enough native for fees )
              //        Specifically increase the payment for performing a bridge transaction by 20%
              //        Should be moved to the indexer side
              const valueWithBuffer = value.mul(120).div(100);
              txReq = {
                to: address,
                data,
                value: valueWithBuffer,
                gasLimit: constants.Zero,
              };
            } else {
              // Classic transaction block
              // When we have contractAddr, method && args
              const contract = new Contract(address, abi).connect(signer);

              txReq = await contract.populateTransaction[method](...args);
              if (value) {
                txReq.value = value;
              }
            }

            txReq.gasLimit = await signer.estimateGas(txReq);

            // Force increase gasLimit to avoid failed txs.
            // Read `forceIncreaseGasLimit` description for more details
            txReq.gasLimit = this.forceIncreaseGasLimit(method, txReq.gasLimit);

            // FIXME: Metamask struggles with gas estimation on Taiko network
            // As a result, transactions fail with an error "Internal JSON-RPC error"
            // As a temporary solution, we set gasPrice manually by multiplying the gasPrice returned from the provider by 2
            const feeData = await signer.provider.getFeeData();
            txReq.gasPrice = feeData.gasPrice.mul(2);

            const tx: TransactionResponse = await signer.sendTransaction(txReq);
            transaction.status = TransactionStatus.waiting;

            if (this.triggerCallback('onSigned', callbacks, transaction))
              return;
            try {
              const receipt: TransactionReceipt = await tx.wait();
              transaction.status = TransactionStatus.succeed;
              transaction.details = await this.getDetails(receipt);
              if (this.triggerCallback('onSent', callbacks, transaction))
                return;
            } catch (e) {
              transaction.status = TransactionStatus.failed;
              transaction.error = i18n.t('errors.transactionFailed');
              transaction.details = await this.getDetails(e.receipt);
              if (this.triggerCallback('onError', callbacks, transaction))
                return;
            }
          } catch (e) {
            if (e.code === -32603) {
              //TODO: 2 same metamask errors for differents state -_-
              if ((e.message as string).includes('Insufficient allowance')) {
                transaction.statusCode = e.code;
              } else {
                transaction.statusCode = -32001;
              }
            } else {
              transaction.statusCode = e.code;
            }
            const localizedError = getLocalizedError({
              ...e,
              code: transaction.statusCode,
            } as IFullError);
            console.log(e);
            throw new Error(localizedError);
          }
        },
        (span: Span) => {
          span.setAction('Transaction');
          span.setParams({
            method: method,
            contract: address,
          });
        }
      )
      .catch((e) => {
        transaction.status = TransactionStatus.failed;
        transaction.error = e.message;
        if (this.triggerCallback('onError', callbacks, transaction)) return;
        throw e;
      });
  };

  // TODO remove copypaste
  callMultiple = async (call: MultiCall, callbacks?: Callbacks) => {
    const transaction: Transaction = { status: TransactionStatus.ready };
    const { address, abi, calls } = call;
    await appsignal
      .wrap(
        async () => {
          try {
            transaction.status = TransactionStatus.signing;
            if (this.triggerCallback('onStart', callbacks, transaction)) return;
            const signer = this.provider.getSigner();
            const MintProxy = new Contract(address, MintProxyABI).connect(
              signer
            );
            const Target = new Contract(address, abi).connect(signer);

            // Prepare calldata for multicall
            const args = calls.map(({ method, args }) =>
              Target.interface.encodeFunctionData(method, [...args])
            );

            const txReq = await MintProxy.populateTransaction['multicall'](
              args
            );

            txReq.gasLimit = await signer.estimateGas(txReq);

            // Force increase gasLimit to avoid failed txs.
            // Read `forceIncreaseGasLimit` description for more details
            txReq.gasLimit = this.forceIncreaseGasLimit(
              'multicall',
              txReq.gasLimit
            );

            // FIXME: Metamask struggles with gas estimation on Taiko network
            // As a result, transactions fail with an error "Internal JSON-RPC error"
            // As a temporary solution, we set gasPrice manually by multiplying the gasPrice returned from the provider by 2
            const feeData = await signer.provider.getFeeData();
            txReq.gasPrice = feeData.gasPrice.mul(2);

            const tx: TransactionResponse = await signer.sendTransaction(txReq);
            transaction.status = TransactionStatus.waiting;
            if (this.triggerCallback('onSigned', callbacks, transaction))
              return;
            try {
              const receipt: TransactionReceipt = await tx.wait();
              transaction.status = TransactionStatus.succeed;
              transaction.details = await this.getDetails(receipt);
              if (this.triggerCallback('onSent', callbacks, transaction))
                return;
            } catch (e) {
              transaction.status = TransactionStatus.failed;
              transaction.error = i18n.t('errors.transactionFailed');
              transaction.details = await this.getDetails(e.receipt);
              if (this.triggerCallback('onError', callbacks, transaction))
                return;
            }
          } catch (e) {
            const localizedError = getLocalizedError(e as IFullError);
            throw new Error(localizedError);
          }
        },
        (span: Span) => {
          span.setAction('Transaction');
          span.setParams({
            methods: calls.map((c) => c.method).join(', '),
            contract: address,
          });
        }
      )
      .catch((e) => {
        transaction.status = TransactionStatus.failed;
        transaction.error = e.message;
        if (this.triggerCallback('onError', callbacks, transaction)) return;
        throw e;
      });
  };

  estimateGas = (call: TCall): Promise<BigNumber> => {
    if (this.isSingleCall(call)) {
      return this.estimateSingleCall(call);
    } else {
      return this.estimateMultiCall(call);
    }
  };

  estimateSingleCall = async (call: SingleCall): Promise<BigNumber> => {
    const { address, abi, method, args } = call;
    const signer = this.provider.getSigner();
    const contract = new Contract(address, abi).connect(signer);
    return BigNumber.from(await contract.estimateGas[method](...args));
  };

  estimateMultiCall = async (call: MultiCall): Promise<BigNumber> => {
    const { address, abi, calls } = call;
    const signer = this.provider.getSigner();
    const Target = new Contract(address, abi).connect(signer);
    const transactions = await Promise.all(
      calls.map(({ method, args }) =>
        Target.populateTransaction[method](...args)
      )
    );
    const MintProxy = new Contract(address, MintProxyABI).connect(signer);
    return BigNumber.from(
      await MintProxy.estimateGas.multicall(
        transactions.map((ptx: PopulatedTransaction) => ptx.data)
      )
    );
  };

  setProvider = (provider: ApiProvider) => {
    this.provider = provider;
  };

  get = (
    method: string,
    address: string,
    abi: ContractInterface,
    args: Iterable<any>
  ): Promise<unknown> => {
    const contract = new Contract(address, abi).connect(this.provider);
    return contract[method](...args);
  };

  setEthPrice = (price: string) => {
    this.ethPrice = utils.parseUnits(price);
  };

  private getBlock = (block: number): Promise<Block> => {
    return this.provider.getBlock(block);
  };

  private getDetails = async (
    tr: TransactionReceipt
  ): Promise<Partial<TxDetails>> => {
    const block = await this.getBlock(tr.blockNumber);
    const timestamp = DateTime.fromMillis(block.timestamp * 1000).toFormat(
      TRANSACTION_RESULT_DATETIME
    );
    const gas = tr.gasUsed;
    // FIXME: gasUsd calculation here is not correct, but is used only in Stake modal window
    // So, fix before enable stake
    const gasUsd = BigNumber.from(expScale);

    return {
      hash: tr.transactionHash,
      timestamp,
      gas,
      gasUsd,
    };
  };
}

export default new TransactionService();
