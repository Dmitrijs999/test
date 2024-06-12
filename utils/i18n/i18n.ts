import i18n, { InitOptions, TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import PhraseInContextEditorPostProcessor from 'i18next-phrase-in-context-editor-post-processor';
import queryString from 'query-string';
import { initReactI18next } from 'react-i18next';

import config from 'config';
import { IFullError } from 'types';
import { REGEXES } from 'utils/constants';

const PROD_ENV = config.ENVIRONMENT === 'prod';

// RESOURCES
export enum Languages {
  en = 'en',
  ru = 'ru',
}

// DEBUG PURPOSE: to check which translation keys is missing
const missingInterpolationHandler = (
  text: string,
  value: string,
  options: InitOptions
) => {
  let interpolation = options?.lng || '';
  const warningMessage = `[missing value: ${value[1]}, please add default value]`;

  if (config.ENVIRONMENT !== 'prod') {
    interpolation =
      (options?.lng &&
        `${warningMessage}: Used default value: ${options?.lng}`) ||
      warningMessage;

    console.warn(interpolation);
  }

  return interpolation;
};

i18n.use(LanguageDetector).use(initReactI18next).use(HttpApi);

const postProcess: string[] = [];

const parsed = queryString.parse(location.search);

if (!PROD_ENV && parsed && parsed.ICE) {
  postProcess.push('phraseInContextEditor');
  i18n.use(
    new PhraseInContextEditorPostProcessor({
      phraseEnabled: true,
      projectId: config.PHRASE_PROJECT_ID,
      autoLowercase: false,
    })
  );
}

const currentTimestamp = new Date().getTime();

i18n
  .init({
    interpolation: { escapeValue: false },
    lng: Languages.en,
    fallbackLng: Languages.en,
    debug: config.ENVIRONMENT !== 'prod',
    react: {
      wait: true,
    },
    saveMissing: true,
    missingInterpolationHandler,
    postProcess,
    backend: {
      loadPath: `/locales/en/translation.json?timestamp=${currentTimestamp}`,
      addPath: '',
    },
  })
  .catch((e) => {
    console.warn('i18n initialization error, ', e);
  });

export const setLanguage = async (lang: string): Promise<TFunction | void> => {
  if (lang in Languages) {
    return i18n.changeLanguage(lang);
  } else {
    console.warn(`${lang} is not the one of available language types`);
    return;
  }
};

export const getCurrentLanguage = (): string => i18n?.language || Languages.en;

const metamaskErrorCodes = {
  ACTION_REJECTED: 'errors.metamask.4001',
};

export const getLocalizedError = (error: IFullError): string => {
  const protocolDefaultValue = i18n.t('errors.protocol.default');
  const metamaskDefaultValue = i18n.t('errors.metamask.default');
  const stringifiedError = JSON.stringify(error);
  /**
   * Error example:
   * {
   *  "code": -32603,
   *  "message": "Internal JSON-RPC error.",
   *  "data": {
   *    "message": "VM Exception while processing transaction: revert E206",
   *    "stack": "RuntimeError: VM Exception while processing transaction: revert E206\n    at exactimate (/usr/lib/node_modules/ganache/dist/node/1.js:2:113020)",
   *    "code": -32000,
   *    "name": "RuntimeError",
   *    "data": {
   *      "hash": null,
   *      "programCounter": 991,
   *      "result": "0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044532303600000000000000000000000000000000000000000000000000000000",
   *      "reason": "E206",
   *      "message": "revert"
   *    }
   *  }
   * }
   */
  if (error?.code && metamaskErrorCodes[error.code]) {
    return i18n.t(metamaskErrorCodes[error.code], {
      defaultValue: metamaskDefaultValue,
    });
  } else if (error?.data?.code) {
    return i18n.t(`errors.metamask.${error.data.code}`, {
      defaultValue: metamaskDefaultValue,
    });
  } else if (stringifiedError?.match(REGEXES.protocolErrorCode)) {
    const matchResult = stringifiedError?.match(REGEXES.protocolErrorCode);
    return i18n.t(`errors.protocol.${matchResult?.[0]}`, {
      defaultValue: protocolDefaultValue,
    });
  } else {
    /**
     * This case is for the live environment
     * Example error:
     * {
     *  "code": -32603,
     *  "message": "execution reverted: E206",
     *  "data": {
     *    "originalError": {
     *      "code": 3,
     *      "data": "0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044532303600000000000000000000000000000000000000000000000000000000",
     *      "message": "execution reverted: E206"
     *    }
     *  }
     * }
     */

    return i18n.t(`errors.metamask.${error?.code}`, {
      defaultValue: metamaskDefaultValue,
    });
  }
};

export default i18n;
