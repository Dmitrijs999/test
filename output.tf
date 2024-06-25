output "s3_bucket" {
  value = aws_s3_bucket.default.bucket
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.default.domain_name}"
}

output "url" {
  value = "https://${aws_route53_record.default.fqdn}"
}
