Imports System.Web.Script.Serialization
Imports System.IO
Imports System.Net

'This program is free software: you can redistribute it and/or modify
'    it under the terms of the GNU General Public License as published by
'    the Free Software Foundation, either version 3 of the License, or
'    (at your option) any later version.

'    This program is distributed in the hope that it will be useful,
'    but WITHOUT ANY WARRANTY; without even the implied warranty of
'    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
'    GNU General Public License for more details.

'    You should have received a copy of the GNU General Public License
'    along with this program.  If not, see <http://www.gnu.org/licenses/>.

Public Class _Default
    Inherits System.Web.UI.Page

    'Serializer used to read the settings
    Private Shared oJavascriptSerializer As New JavaScriptSerializer
    'Settings object
    Private Shared oSettings As Dictionary(Of String, Object)

    Protected Sub Page_Load(sender As Object, e As System.EventArgs) Handles Me.Load
        Try
            If Not IsPostBack Then
                'Show the different page's elements depends the settings 
                loadDisplay()
            End If
            'Get the url routing parameters (See Global.asax)
            'action : authorization,authorizationcallback,settings
            'service : facebook,twitter,linkedin
            Dim action = IIf(Not IsNothing(Page.RouteData.Values("action")), Page.RouteData.Values("action"), "")
            Dim service = IIf(Not IsNothing(Page.RouteData.Values("service")), Page.RouteData.Values("service"), "")
            Select Case action
                Case "authorization"
                    'Add new Social Service authorization
                    If service <> "" Then
                        If Not IsNothing(oSettings) Then
                            ' Build simply the Singly Uri 
                            Dim sAuthUrl = "https://api.singly.com/oauth/authorize"
                            sAuthUrl &= "?client_id=" & oSettings("singly_clientId")
                            Dim sCallBackUri As String = Request.Url.Authority
                            If Not sCallBackUri.EndsWith("/") Then
                                sCallBackUri &= "/"
                            End If
                            If Not sCallBackUri.StartsWith("http") Then
                                sCallBackUri = "http://" & sCallBackUri
                            End If
                            sCallBackUri &= "singly/authorizationcallback/" & service & "/"
                            sAuthUrl &= "&redirect_uri=" & sCallBackUri
                            sAuthUrl &= "&service=" & service
                            If oSettings.ContainsKey("singly_account") Then
                                sAuthUrl &= "&account=" & oSettings("singly_account")
                            End If
                            'Redirect to Singly authorize, witch will redirect you to the service Auth (Facebook, Twitter...)
                            Response.Redirect(sAuthUrl)
                        End If
                    End If
                Case "authorizationcallback"
                    If Not IsNothing(Request("error")) Then
                        'TODO : Handle the error. If the "error" querystring parameter exists, something wrong during the Authentication process.
                    Else
                        If Not IsNothing(Request("code")) Then
                            'The callback URL contains the Authentication code
                            'Build the request body with three parameters : singly_clientId, singly_clientSecret, code
                            Dim data As StringBuilder = New StringBuilder()
                            data.Append("client_id=" & HttpUtility.UrlEncode(oSettings("singly_clientId")))
                            data.Append("&client_secret=" & HttpUtility.UrlEncode(oSettings("singly_clientSecret")))
                            data.Append("&code=" & HttpUtility.UrlEncode(Request("code")))
                            'Build the Authentication URL 
                            Dim url = "https://api.singly.com/oauth/access_token"
                            Dim sJSONResult As String = ""
                            'Send the request
                            sJSONResult = sendRequest(url, data, "POST") & vbNewLine
                            'Get the JSON result
                            Dim oJSONResult As Dictionary(Of String, Object) = oJavascriptSerializer.DeserializeObject(sJSONResult)
                            Dim bResult As Boolean = False
                            If oJSONResult.ContainsKey("access_token") Then
                                'If the JSON constains access_token, the authentication succeeded
                                'Add the service access_token to the settings
                                bResult = buildSettings(service & "_access_token", oJSONResult("access_token"))
                                If Not oSettings.ContainsKey("singly_account") Then
                                    'Add the singly_account value if it doesn't exist. See Singly doc for more informations
                                    bResult = buildSettings("singly_account", oJSONResult("account"))
                                End If
                            End If
                            'Redirect to Default page which will load the data of the added social service
                            Response.Redirect("/singly")
                        End If
                    End If
                Case "settings"
                    'After provide the singly basic codes
                    If Request.Form("TextBoxSinglyClientId") <> "" And Request.Form("TextBoxSinglyClientSecret") <> "" Then
                        'Build the settings and load the default display
                        buildSettings("singly_clientId", Request.Form("TextBoxSinglyClientId"))
                        buildSettings("singly_clientSecret", Request.Form("TextBoxSinglyClientSecret"))
                        loadDisplay()
                    End If
            End Select
        Catch exThread As Threading.ThreadAbortException
            Throw exThread
        Catch ex As Exception
        End Try
    End Sub

    <System.Web.Services.WebMethod()> _
    Public Shared Function proxy(url As String, type As String, param As String, service As String) As String
        'Proxy called by the client code
        Try
            If Not IsNothing(oSettings) Then
                If Not url = "" Then
                    Dim data As StringBuilder = New StringBuilder()
                    'Build the call parameters
                    data.Append("?access_token=" & HttpUtility.UrlEncode(oSettings(service & "_access_token")))
                    If param <> """""" Then
                        'Add optional parameters, depends on the call
                        Dim oListParam As Dictionary(Of String, Object) = oJavascriptSerializer.DeserializeObject(param)
                        For Each oParam In oListParam
                            data.Append("&" & oParam.Key & "=" & HttpUtility.UrlEncode(oParam.Value))
                        Next
                    End If
                    Dim sJSONResult As String = ""
                    'Send the request
                    sJSONResult = sendRequest(url, data, type) & vbNewLine
                    Return sJSONResult
                End If
            End If
            Return ""
        Catch ex As Exception
            Return ""
        End Try
    End Function

    Private Sub loadDisplay()
        Try
            'Default case, the settings part is hidden
            settings.Visible = False
            'Display the content and the social sites selector
            Content.Visible = True
            socialsSites.Visible = True
            'Load the settings
            oSettings = getSettings()
            If Not IsNothing(oSettings) Then
                'If the settings are enabled
                If oSettings.ContainsKey("twitter_access_token") Then
                    'Twitter is already configured
                    HyperLinkAuthentTwitter.Enabled = False
                    iconTwitter.ImageUrl = "/images/socialmedia/twitter.png"
                End If
                If oSettings.ContainsKey("facebook_access_token") Then
                    'Facebook is already configured
                    HyperLinkAuthentFacebook.Enabled = False
                    iconFacebook.ImageUrl = "/images/socialmedia/facebook.png"
                End If
                If oSettings.ContainsKey("linkedin_access_token") Then
                    'Linkedin is already configured
                    HyperLinkAuthentLinkedin.Enabled = False
                    iconLinkedin.ImageUrl = "/images/socialmedia/linkedin.png"
                End If
            Else
                'No settings, display the settings block to fill the singly informations
                settings.Visible = True
                Content.Visible = False
                socialsSites.Visible = False
            End If
        Catch ex As Exception
        End Try
    End Sub

    Private Function saveSettings(Settings As String) As Boolean
        Try
            'Save the settings as JSON format file
            Dim sPath As String = Request.PhysicalApplicationPath
            If Not sPath.EndsWith("\") Then
                sPath &= "\"
            End If
            Dim oIOWriter As New IO.StreamWriter(sPath & "\settings\setting.js", False)
            oIOWriter.Write(Settings)
            oIOWriter.Close()
            Return True
        Catch ex As Exception
            Return False
        End Try
    End Function

    Private Function buildSettings(sKey As String, sValue As String) As Boolean
        Try
            'Get the existing settings
            Dim oSettings As Dictionary(Of String, Object) = getSettings()
            If Not IsNothing(oSettings) Then
                'The settings exists
                If oSettings.ContainsKey(sKey) Then
                    'The speciefied key exists, update the value
                    oSettings(sKey) = sValue
                Else
                    'Add the new key/value
                    oSettings.Add(sKey, sValue)
                End If
            Else
                'Create the settings Dictionary
                oSettings = New Dictionary(Of String, Object)
                'Add the new key/value
                oSettings.Add(sKey, sValue)
            End If
            Dim sSettingsContent As String
            'Serialize the Dictionary to a JSON string
            Dim oJavascriptSerializer As New JavaScriptSerializer
            sSettingsContent = oJavascriptSerializer.Serialize(oSettings)
            'Save the settings
            saveSettings(sSettingsContent)
            Return True
        Catch ex As Exception
            Return False
        End Try
    End Function

    Private Function getSettings() As Dictionary(Of String, Object)
        Try
            Dim oSettings As New Dictionary(Of String, Object)
            Dim sSettingsContent As String = ""
            Dim sPath As String = Request.PhysicalApplicationPath
            If Not sPath.EndsWith("\") Then
                sPath &= "\"
            End If
            'Open and read the settings file
            If IO.File.Exists(sPath & "settings\setting.js") Then
                Dim oIOReader As New IO.StreamReader(sPath & "settings\setting.js")
                sSettingsContent = oIOReader.ReadToEnd()
                oIOReader.Close()
                'Deserialize th JSON string to a Dictionary
                oSettings = oJavascriptSerializer.DeserializeObject(sSettingsContent)
                Return oSettings
            Else
                Return Nothing
            End If
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Private Shared Function sendRequest(url As String, requestBody As StringBuilder, type As String) As String
        Try
            Dim oWebRequest
            If type = "POST" Then
                'The call method is a POST, Creation of the WebRequest with the url
                'The parameters will be added in the request body
                oWebRequest = WebRequest.Create(url)
            Else
                'The call method is a GET, Creation of the WebRequest with the url
                'And add the parameters as querystring
                oWebRequest = WebRequest.Create(url & requestBody.ToString)
            End If
            oWebRequest.Method = type
            oWebRequest.ContentType = "application/x-www-form-urlencoded"
            If requestBody.ToString <> "" And type = "POST" Then
                'Create the reauest body
                Dim byteData As Byte() = UTF8Encoding.UTF8.GetBytes(requestBody.ToString())
                oWebRequest.ContentLength = byteData.Length
                Dim webRequestStream As Stream = oWebRequest.GetRequestStream()
                webRequestStream.Write(byteData, 0, byteData.Length)
            End If
            'Send the request
            Dim response As HttpWebResponse = CType(oWebRequest.GetResponse(), HttpWebResponse)
            Dim dataStream As Stream = response.GetResponseStream()
            'Read and return the result as string
            Dim reader As New StreamReader(dataStream)
            Dim sResult As String = reader.ReadToEnd()
            Return sResult
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

End Class