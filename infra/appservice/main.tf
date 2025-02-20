
resource "azurerm_service_plan" "plan" {
  name                = "lowtechgmbh_appservice_plan"
  resource_group_name = var.rg_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "backend" {
  name                      = "lowtechgmbh-backend"
  resource_group_name       = var.rg_name
  location                  = azurerm_service_plan.plan.location
  service_plan_id           = azurerm_service_plan.plan.id
  virtual_network_subnet_id = var.subnet_id

  site_config {
    app_command_line = "python3.11 runner.py"
  }

  app_settings = {
    AZURE_DATABASE_URL             = var.db_url
    MAIL_USERNAME                  = var.mail_username
    MAIL_PASSWORD                  = var.mail_password
    MAIL_FROM                      = var.mail_from
    MAIL_PORT                      = var.mail_port
    MAIL_SERVER                    = var.mail_server
    SCM_DO_BUILD_DURING_DEPLOYMENT = var.scm_do_build_during_deployment
  }

}
