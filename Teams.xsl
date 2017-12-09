<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template match="/">
				<table id = "myTable">
					<tr>
						<th onclick="sortTable(0)">Name</th>
						<th onclick="sortTable(1)">Team</th>
						<th onclick="sortTable(2)">Captain</th>
						<th onclick="sortTable(3)">Stadium</th>
					</tr>
					<xsl:for-each select="myTeams/team">
							<tr>
								<td id="{position()}"> 
									<xsl:value-of select="Name"/>
								</td>
								<td id="{position()}">
									<xsl:value-of select="Team"/>
								</td>
								<td id="{position()}">
									<xsl:value-of select="Captain"/>
								</td>
								<td id="{position()}">
									<xsl:value-of select="Stadium"/>
								</td>
							</tr>
					</xsl:for-each>
				</table>
	</xsl:template>
</xsl:stylesheet>