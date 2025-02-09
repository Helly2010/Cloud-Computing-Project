
resource "azurerm_service_plan" "plan" {
  name                = "lowtechgmbh_appservice_plan"
  resource_group_name = var.rg_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "backend" {
  name                = "lowtechgmbh-backend"
  resource_group_name = var.rg_name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {

  }

  virtual_network_subnet_id = var.subnet_id


}
