include {
  path = find_in_parent_folders()
}

dependency "domain_certificate" {
  config_path = "../../../us-east-1/pre-prod/domain-certificate"
}

dependency "unsupported_countries_ip_blocker" {
  config_path = "../../../us-east-1/common/unsupported-countries-ip-blocker"
}

dependency "auth_proxy" {
  config_path = "../../../us-east-1/common/auth-proxy"
}

dependency "ddos_protection" {
  config_path = "../../../us-east-1/common/ddos-protection"
}

dependency "indexer_api" {
  config_path = "../indexer-api-mantle"
}

dependency "contracts" {
  config_path = "../../common/abi-contracts"
}

dependency "locales" {
  config_path = "../../dev/phrase-locale-manager"
}


inputs = {
  domain_certificate_arn                      = dependency.domain_certificate.outputs.certificate_arn
  route53_zone_id                             = dependency.domain_certificate.outputs.route53_zone_id
  auth_proxy_lambda_arn                       = dependency.auth_proxy.outputs.lambda_arn
  ddos_protection_web_acl_id                  = dependency.ddos_protection.outputs.web_acl_id
  indexer_api_domain_name                     = trimprefix(dependency.indexer_api.outputs.url, "https://")
  indexer_api_tg_arn_suffix                   = dependency.indexer_api.outputs.tg_arn_suffix
  indexer_api_lb_arn_suffix                   = dependency.indexer_api.outputs.lb_arn_suffix
  unsupporter_countries_ip_blocker_lambda_arn = dependency.unsupported_countries_ip_blocker.outputs.lambda_arn
  contracts_s3_bucket_domain_name             = dependency.contracts.outputs.s3_bucket_domain_name
  locales_s3_bucket                           = dependency.locales.outputs.s3_bucket
}
