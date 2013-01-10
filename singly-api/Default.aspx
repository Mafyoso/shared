<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="Singly_Test._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Singly API Tester</title>
    <link href="/css/yb/jquery-ui-1.8.23.custom.css" rel="stylesheet" type="text/css" />
    <link href="/css/main.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="/js/jquery-1.7.2.min.js" type="text/javascript"></script>
    <script src="/js/jquery-ui-1.8.22.custom.min.js" type="text/javascript"></script>
    <script src="/js/jquery.tinyscrollbar.min.js" type="text/javascript"></script>
    <script src="/js/singly-data.js" type="text/javascript"></script>
    <script src="/js/singly-ui.js" type="text/javascript"></script>
    <script src="/js/singly-system.js" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="main" class="ui-widget ui-widget-content ui-corner-all">
        <h1>
            Singly API</h1>
        <div id="socialsSites" runat="server">
            <asp:HyperLink ID="HyperLinkAuthentTwitter" NavigateUrl="singly/authorization/twitter"
                runat="server">
                <asp:Image ID="iconTwitter" runat="server" ImageUrl="/images/socialmedia/twitter_g.png"
                    ToolTip="Twitter" AlternateText="Twitter" Width="32" /></asp:HyperLink>
            <asp:HyperLink ID="HyperLinkAuthentFacebook" NavigateUrl="singly/authorization/facebook"
                runat="server">
                <asp:Image ID="iconFacebook" runat="server" ImageUrl="/images/socialmedia/facebook_g.png"
                    ToolTip="Facebook" AlternateText="Facebook" Width="32" /></asp:HyperLink>
            <asp:HyperLink ID="HyperLinkAuthentLinkedin" NavigateUrl="singly/authorization/linkedin"
                runat="server">
                <asp:Image ID="iconLinkedin" runat="server" ImageUrl="/images/socialmedia/linkedin_g.png"
                    ToolTip="Linkedin" AlternateText="Linkedin" Width="32" /></asp:HyperLink><br />
        </div>
        <div id="settings" runat="server">
            Please provide your Singly authentication informations
            <br />
            <div class="singly-content-label-float">
                Singly Client Id :
            </div>
            <div class="singly-content-input-float">
                <asp:TextBox ID="TextBoxSinglyClientId" runat="server" Width="250" EnableViewState="true"></asp:TextBox>
            </div>
            <div style="clear: both">
            </div>
            <div class="singly-content-label-float">
                Singly Client Secret :
            </div>
            <div class="singly-content-input-float">
                <asp:TextBox ID="TextBoxSinglyClientSecret" runat="server" Width="250" EnableViewState="true"></asp:TextBox>
            </div>
            <div style="clear: both">
            </div>
            <asp:Button ID="ButtonSaveSettings" EnableViewState="false" runat="server" Text="Save"
                PostBackUrl="/singly/settings" />
        </div>
        <div id="content" runat="server">
            <div class="scrollbar">
                <div class="track">
                    <div class="thumb">
                        <div class="end">
                        </div>
                    </div>
                </div>
            </div>
            <div class="viewport">
                <div class="overview">
                    <div id="contentLeft" style="width: 25%; float: left; margin: 1%;">
                    </div>
                    <div id="contentCenter" style="width: 70%; float: left; margin: 1%;">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="footer">
        <a title="Free Social Media Icon Set" target="_blank" href="http://www.elegantthemes.com/blog/resources/free-social-media-icon-set">
            Free Social Media Icon Set by Elegant Themes. </a>&nbsp;|&nbsp;<a href="http://singly.com"
                target="_blank">Singly</a>&nbsp;|&nbsp;<a href="http://jquery.com" target="_blank">Jquery</a>
        &nbsp;|&nbsp;<a href="http://jqueryui.com/" target="_blank">Jquery UI</a>
        &nbsp;|&nbsp;<a href="https://developers.google.com/chart/?hl=fr" target="_blank">Google Chart</a>
    </div>
    <br />
    </form>
</body>
</html>
