variable "organisation" {}

variable "environment" {}

variable "application" {}

variable "aws_account_id" {}

variable "aws_region" {}

variable "main_domain" {}

variable "com_domain_certificate_arn" {}

variable "domain_certificate_arn" {}

variable "route53_zone_id" {}

variable "auth_proxy_lambda_arn" {}

variable "cloudflare_zone_id" {}

variable "indexer_api_domain_name" {}

variable "indexer_api_tg_arn_suffix" {}

variable "indexer_api_lb_arn_suffix" {}

variable "poffchainer_domain_name" {}

variable "poffchainer_gateway_id" {}

variable "unsupporter_countries_ip_blocker_lambda_arn" {}

variable "ddos_protection_web_acl_id" {}

variable "contracts_s3_bucket_domain_name" {}

variable "locales_s3_bucket" {
  type = object({
    id          = string
    arn         = string
    domain_name = string
  })
}
