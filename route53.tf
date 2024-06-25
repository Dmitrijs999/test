resource "aws_route53_record" "default" {
  zone_id = var.route53_zone_id
  name    = local.url
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.default.domain_name
    zone_id                = aws_cloudfront_distribution.default.hosted_zone_id
    evaluate_target_health = true
  }
}
