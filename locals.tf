locals {
  url               = "mantle.${var.environment}.${var.main_domain}"
  default_cache_ttl = 86400  # 1 day for non-prod environment
  max_cache_ttl     = 604800 # 1 week for non-prod environment
}
