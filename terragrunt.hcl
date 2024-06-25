include {
  path = find_in_parent_folders()
}

dependency "domain_certificate" {
  config_path = "../../../us-east-1/common/domain-certificate"
}

dependency "unsupported_countries_ip_blocker" {
  config_path = "../../../us-east-1/common/unsupported-countries-ip-blocker"
}

dependency "ddos_protection" {
  config_path = "../../../us-east-1/common/ddos-protection"
}

dependency "auth_proxy" {
  config_path = "../../../us-east-1/common/auth-proxy"
}

dependency "indexer_api" {
  config_path = "../indexer-api-mantle"
}

dependency "poffchainer" {
  config_path = "../poffchainer"
}

dependency "contracts" {
  config_path = "../../common/abi-contracts"
}

dependency "locales" {
  config_path = "../phrase-locale-manager"
}

dependency "route53" {
  config_path = "../../common/route53"
}

inputs = {
  domain_certificate_arn                      = dependency.domain_certificate.outputs.certificate_arn
  com_domain_certificate_arn                  = dependency.domain_certificate.outputs.com_certificate_arn
  route53_zone_id                             = dependency.route53.outputs.zone_id
  indexer_api_domain_name                     = trimprefix(dependency.indexer_api.outputs.url, "https://")
  indexer_api_tg_arn_suffix                   = dependency.indexer_api.outputs.tg_arn_suffix
  indexer_api_lb_arn_suffix                   = dependency.indexer_api.outputs.lb_arn_suffix
  poffchainer_domain_name                     = trimprefix(dependency.poffchainer.outputs.url, "https://")
  poffchainer_gateway_id                      = dependency.poffchainer.outputs.api_gateway_id
  unsupporter_countries_ip_blocker_lambda_arn = dependency.unsupported_countries_ip_blocker.outputs.lambda_arn
  ddos_protection_web_acl_id                  = dependency.ddos_protection.outputs.web_acl_id
  auth_proxy_lambda_arn                       = dependency.auth_proxy.outputs.lambda_arn
  contracts_s3_bucket_domain_name             = dependency.contracts.outputs.s3_bucket_domain_name
  locales_s3_bucket                           = dependency.locales.outputs.s3_bucket
}
