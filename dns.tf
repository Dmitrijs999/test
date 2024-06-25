resource "cloudflare_record" "default" {
  zone_id = var.cloudflare_zone_id
  name    = local.url
  value   = aws_cloudfront_distribution.default.domain_name
  type    = "CNAME"
  proxied = false
}

# Created here as the .minterest.xyz domain is managed in dev environment
resource "aws_route53_record" "internal" {
  zone_id = var.route53_zone_id
  name    = local.internal_url
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.internal.domain_name
    zone_id                = aws_cloudfront_distribution.internal.hosted_zone_id
    evaluate_target_health = true
  }
}
