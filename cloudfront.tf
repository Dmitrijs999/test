resource "aws_cloudfront_distribution" "default" {
  origin {
    domain_name = aws_s3_bucket.default.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.default.bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = var.contracts_s3_bucket_domain_name
    origin_id   = "contracts"
    origin_path = "/addresses/mantleSepolia"
  }

  origin {
    domain_name = var.contracts_s3_bucket_domain_name
    origin_id   = "gas-costs"
    origin_path = "/gas-costs/mantleTestnet"
  }

  origin {
    domain_name         = var.indexer_api_domain_name
    origin_id           = "indexer-api"
    connection_attempts = 1

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.application}-${var.environment}"

  aliases = [local.url]

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.default.bucket
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.static_cache.id

    min_ttl     = 1
    default_ttl = local.default_cache_ttl
    max_ttl     = local.max_cache_ttl

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type   = "viewer-request"
      include_body = false
      lambda_arn   = var.auth_proxy_lambda_arn
    }
  }

  ordered_cache_behavior {
    path_pattern               = "/index.html"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.default.bucket
    response_headers_policy_id = aws_cloudfront_response_headers_policy.content_security.id

    min_ttl                = 0
    default_ttl            = 5
    max_ttl                = 5
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }

      headers = [
        "CloudFront-Viewer-Country",
        "CloudFront-Viewer-Country-Region",
        "CloudFront-Viewer-Country-Region-Name",
      ]
    }

    lambda_function_association {
      event_type   = "viewer-request"
      include_body = false
      lambda_arn   = var.auth_proxy_lambda_arn
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/addresses.json"
    allowed_methods  = ["HEAD", "GET", "OPTIONS"]
    cached_methods   = ["HEAD", "GET"]
    target_origin_id = "contracts"

    min_ttl                = 0
    default_ttl            = 5
    max_ttl                = 5
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      headers = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin",
      ]

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/gas-costs.json"
    allowed_methods  = ["HEAD", "GET", "OPTIONS"]
    cached_methods   = ["HEAD", "GET"]
    target_origin_id = "gas-costs"


    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      headers = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin",
      ]

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "indexer-api"

    min_ttl                = 1
    default_ttl            = 1
    max_ttl                = 1
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
  }

  # Allows passing the control of the URL addresses managed on frontend to React Router
  # A document which doesn't exist on s3 will be resolved into /index.html for UI to handle routing
  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  web_acl_id = var.ddos_protection_web_acl_id

  viewer_certificate {
    acm_certificate_arn = var.domain_certificate_arn
    ssl_support_method  = "sni-only"
  }
}
