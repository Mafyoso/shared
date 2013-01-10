<%@ Application Language="VB" %>
<%@ Import Namespace="System.Web.Routing" %>

<script runat="server">

    Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
        RegisterRoutes(RouteTable.Routes)
    End Sub
    
    Sub Application_End(ByVal sender As Object, ByVal e As EventArgs)
    End Sub
        
    Sub Application_Error(ByVal sender As Object, ByVal e As EventArgs)
    End Sub

    Sub Session_Start(ByVal sender As Object, ByVal e As EventArgs)
    End Sub

    Sub Session_End(ByVal sender As Object, ByVal e As EventArgs)
    End Sub
    
    Sub RegisterRoutes(ByVal routes As RouteCollection)
        'Define the Map Route
        routes.MapPageRoute("", "singly", "~/Default.aspx", True)
        routes.MapPageRoute("", "singly/{action}", "~/Default.aspx", True)
        routes.MapPageRoute("", "singly/{action}/{service}", "~/Default.aspx", True)
    End Sub
       
</script>