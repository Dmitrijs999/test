resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "app-${var.environment}"

  dashboard_body = jsonencode({
    "widgets" : [
      {
        "height" : 6,
        "width" : 5,
        "y" : 6,
        "x" : 0,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["AWS/CloudFront", "Requests", "Region", "Global", "DistributionId", "${aws_cloudfront_distribution.default.id}", { "region" : "us-east-1" }]
          ],
          "view" : "timeSeries",
          "stacked" : true,
          "region" : "${var.aws_region}",
          "stat" : "Sum",
          "period" : 60,
          "title" : "CloudFront - Requests per minute",
          "liveData" : true
        }
      },
      {
        "height" : 6,
        "width" : 6,
        "y" : 6,
        "x" : 5,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["AWS/ApiGateway", "Count", "ApiId", "${var.poffchainer_gateway_id}", { "label" : "Poffchainer" }],
            ["AWS/ApplicationELB", "RequestCount", "TargetGroup", "${var.indexer_api_tg_arn_suffix}", "LoadBalancer", "${var.indexer_api_lb_arn_suffix}", { "label" : "Indexer API" }]
          ],
          "view" : "timeSeries",
          "stacked" : true,
          "region" : "${var.aws_region}",
          "liveData" : true,
          "stat" : "Sum",
          "period" : 60,
          "title" : "Indexer API - Requests per minute"
        }
      },
      {
        "height" : 6,
        "width" : 5,
        "y" : 0,
        "x" : 11,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["AWS/ApiGateway", "4xx", "ApiId", "${var.poffchainer_gateway_id}", { "color" : "#bcbd22", "label" : "Poffchainer 4xx" }],
            [".", "5xx", ".", ".", { "color" : "#ff9896", "label" : "Poffchainer 5xx" }],
            ["AWS/ApplicationELB", "HTTPCode_Target_4XX_Count", "TargetGroup", "${var.indexer_api_tg_arn_suffix}", "LoadBalancer", "${var.indexer_api_lb_arn_suffix}", { "label" : "Indexer API 4xx", "color" : "#f89256" }],
            [".", "HTTPCode_Target_5XX_Count", ".", ".", ".", ".", { "label" : "Indexer API 5xx" }]
          ],
          "view" : "timeSeries",
          "stacked" : true,
          "region" : "${var.aws_region}",
          "stat" : "Sum",
          "period" : 60,
          "liveData" : true,
          "title" : "Indexer API - Error responses per minute"
        }
      },
      {
        "height" : 6,
        "width" : 5,
        "y" : 0,
        "x" : 0,
        "type" : "alarm",
        "properties" : {
          "title" : "Alerts",
          "alarms" : [
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-api-${var.environment} - Too many errors",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-api-${var.environment} - Too long request processing time",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-api-${var.environment} - Healthy hosts count",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-scrapper-${var.environment} - Too few blocks scrapped",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-scrapper-${var.environment} - Too many errors",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:poffchainer-${var.environment} - Too many errors",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-scrapper-${var.environment} - Block time hanlding too long",
            "arn:aws:cloudwatch:${var.aws_region}:${var.aws_account_id}:alarm:indexer-api-${var.environment} - High memory utilization",
          ]
        }
      },
      {
        "height" : 6,
        "width" : 21,
        "y" : 12,
        "x" : 0,
        "type" : "log",
        "properties" : {
          "query" : "SOURCE '/aws/ecs/indexer-api-${var.environment}' | fields @timestamp, @message\n| sort @timestamp desc\n| limit 20",
          "region" : "${var.aws_region}",
          "stacked" : false,
          "view" : "table"
        }
      },
      {
        "height" : 5,
        "width" : 21,
        "y" : 18,
        "x" : 0,
        "type" : "log",
        "properties" : {
          "query" : "SOURCE '/aws/lambda/poffchainer-${var.environment}' | fields @timestamp, @message\n| sort @timestamp desc\n| limit 20",
          "region" : "${var.aws_region}",
          "stacked" : false,
          "view" : "table"
        }
      },
      {
        "height" : 6,
        "width" : 5,
        "y" : 6,
        "x" : 11,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["custom/indexer-scrapper/${var.environment}", "block_time_handling"]
          ],
          "region" : "${var.aws_region}",
          "stacked" : false,
          "title" : "Scrapper - Block time handling",
          "view" : "timeSeries"
        }
      },
      {
        "height" : 6,
        "width" : 5,
        "y" : 0,
        "x" : 16,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["ECS/ContainerInsights", "MemoryUtilized", "ServiceName", "indexer-api-${var.environment}", "ClusterName", "ecs-cluster-${var.environment}"],
            [".", "MemoryReserved", ".", ".", ".", "."]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "Average",
          "period" : 300,
          "title" : "Indexer API - Memory Usage"
        }
      },
      {
        "height" : 6,
        "width" : 6,
        "y" : 0,
        "x" : 5,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["AWS/ApplicationELB", "TargetResponseTime", "TargetGroup", "${var.indexer_api_tg_arn_suffix}", "LoadBalancer", "${var.indexer_api_lb_arn_suffix}", { "label" : "p50", "stat" : "p50" }],
            ["...", { "label" : "p90", "stat" : "p90" }],
            ["...", { "label" : "p100" }]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "p100",
          "period" : 300,
          "title" : "Indexer API - Response time",
          "legend" : {
            "position" : "bottom"
          }
        }
      },
      {
        "height" : 23,
        "width" : 3,
        "y" : 0,
        "x" : 21,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["ECS/ContainerInsights", "PendingTaskCount", "ServiceName", "indexer-api-${var.environment}", "ClusterName", "ecs-cluster-${var.environment}"],
            [".", "RunningTaskCount", ".", ".", ".", "."],
            [".", "NetworkTxBytes", ".", ".", ".", "."],
            [".", "EphemeralStorageUtilized", ".", ".", ".", "."],
            [".", "EphemeralStorageReserved", ".", ".", ".", "."],
            [".", "StorageReadBytes", ".", ".", ".", "."],
            [".", "NetworkRxBytes", ".", ".", ".", "."],
            [".", "StorageWriteBytes", ".", ".", ".", "."],
            [".", "DesiredTaskCount", ".", ".", ".", "."]
          ],
          "view" : "singleValue",
          "stacked" : true,
          "region" : "${var.aws_region}",
          "period" : 300,
          "stat" : "Average",
          "setPeriodToTimeRange" : false,
          "liveData" : false,
          "sparkline" : true,
          "trend" : true,
          "singleValueFullPrecision" : false,
          "title" : "ECS API Stats"
        }
      },
      {
        "height" : 6,
        "width" : 5,
        "y" : 6,
        "x" : 16,
        "type" : "metric",
        "properties" : {
          "metrics" : [
            ["ECS/ContainerInsights", "CpuReserved", "ServiceName", "indexer-api-${var.environment}", "ClusterName", "ecs-cluster-${var.environment}"],
            [".", "CpuUtilized", ".", ".", ".", "."]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "Average",
          "period" : 300,
          "title" : "Indexer API - CPU"
        }
      }
    ]
  })
}
