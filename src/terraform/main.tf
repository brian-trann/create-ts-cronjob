resource "kubernetes_cron_job" "my-project" {
    count = length(var.boards)

    metadata{
        name = "my-project"
        namespace = var.namespace
    }

    spec {
        concurrency_policy = "Forbid"
        failed_jobs_history_limit = var.jobs_history.failed
        successful_jobs_history_limit = var.jobs_history.successful
        schedule = var.boards[count.index].schedule
        job_template {
            metadata {}
            spec {
                backoff_limit = var.backoff_limit
                ttl_seconds_after_finished = 86400
                template {
                    metadata {}
                    spec {
                        container {
                            name = "my-project"
                            image = var.image
                            env {
                                name = "BOARD_NAME"
                                value = var.boards[count.index].name
                            }
                            env_from {
                                secret_ref {
                                    name = "my-project-secrets"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}