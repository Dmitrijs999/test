resource "aws_cloudfront_origin_request_policy" "geoblock_headers" {
  name    = "${var.application}-${var.environment}-geoblock-headers-propagation"
  comment = "Allows to propagate headers required for GeoBlock functionality on lambda edge to work"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "CloudFront-Viewer-Country",
        "CloudFront-Viewer-Country-Region",
        "CloudFront-Viewer-Country-Region-Name",
        "CloudFront-Viewer-Address",
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "none"
  }
}
