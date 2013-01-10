/*This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

//Initialize the Google Chart API
google.load("visualization", "1", { packages: ["corechart"] });
//Jquery is ready
$(document).ready(function () {
    //Initialize the content main scrollbar
    $("#content").tinyscrollbar({ scroll: false });
    //Transform the save button in jquery ui button if the display is in "Settings Mode"
    if ($("#settings").length > 0) {
        $("#ButtonSaveSettings").button();
    }
    //function callRequest (see singly-data.js)
    // arg0 : Type of http request
    // arg1 : Request url
    // arg2 : Service name
    // arg3 : Callback function 
    if ($("#iconTwitter").length > 0) {
        //Call the two twitter requests, twitter and twitter self
        callRequest("GET", "https://api.singly.com/v0/services/twitter", "", "twitter", twitterDisplay);
        //The fields are defined to reduce the size of the JSON response
        callRequest("GET", "https://api.singly.com/v0/services/twitter/self",
           { "fields": "data.description,data.status.text,data.name,data.followers_count,data.friends_count,data.profile_image_url" },
           "twitter", twitterDisplaySelf);
    }
    if ($("#iconFacebook").length > 0) {
        //Call the two facebook requests, facebook and facebook self
        callRequest("GET", "https://api.singly.com/v0/services/facebook", "", "facebook", facebookDisplay);
        //The fields are defined to reduce the size of the JSON response
        callRequest("GET", "https://api.singly.com/v0/services/facebook/self", { "fields": "data.name,data.hometown.name,data.gender,data.location.name,data.id" }, "facebook", facebookDisplaySelf);
    }
    if ($("#iconLinkedin").length > 0) {
        //Call the linkedin request
        callRequest("GET", "https://api.singly.com/v0/services/linkedin/self", "", "linkedin", linkedinSelf);
    }
});