resource "aws_cloudfront_response_headers_policy" "static_cache" {
  name = "${var.application}-${var.environment}-static-cache"

  custom_headers_config {
    items {
      header   = "Cache-Control"
      override = true
      value    = "max-age=${local.max_cache_ttl}"
    }
  }

  security_headers_config {
    content_security_policy {
      content_security_policy = "frame-ancestors 'self' ${local.url};"
      override                = true
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "content_security" {
  name = "${var.application}-${var.environment}-content-security"

  security_headers_config {
    content_security_policy {
      content_security_policy = "frame-ancestors 'self' ${local.url};"
      override                = true
    }
  }
}
