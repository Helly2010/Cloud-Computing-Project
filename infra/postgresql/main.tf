

resource "azurerm_postgresql_flexible_server" "postgresql_db" {
  name                          = "lowtechgbh-postgresql"
  resource_group_name           = var.rg_name
  location                      = var.location
  version                       = "14"
  delegated_subnet_id           = var.subnet_id
  private_dns_zone_id           = var.dns_zone_id
  public_network_access_enabled = false
  administrator_login           = var.username
  administrator_password        = var.password

  storage_mb   = 32768
  storage_tier = "P4"

  sku_name = "B_Standard_B1ms"


}
