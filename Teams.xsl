<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template match="/">
				<table id = "myTable">
					<tr>
						<th>Name</th>
						<th>Location</th>
						<th>Captain</th>
						<th>Nickname</th>
						<th>Delete</th>
					</tr>
					<xsl:for-each select="myTeams/team">
							<tr>
								<td id="{position()}"> 
									<xsl:value-of select="Name"/>
								</td>
								<td id="{position()}">
									<xsl:value-of select="Location"/>
								</td>
								<td id="{position()}">
									<xsl:value-of select="Captain"/>
								</td>
								<td id="{position()}">
									<xsl:value-of select="Nickname"/>
								</td>
								<td width="50" align="center">
   							<input name="Delete"   Type="image"   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8fKHCFVrE95Z-3y8bVZ6KB-3I7Xvzy3MkedTp0FOd_3peBY7zQQ" height ="20" width ="20" text-alignment ="center">
      					<xsl:attribute name="onclick">myDeleteFunction(event)</xsl:attribute>
   							</input>
							</td>
							</tr>
					</xsl:for-each>
				</table>
	</xsl:template>
</xsl:stylesheet>