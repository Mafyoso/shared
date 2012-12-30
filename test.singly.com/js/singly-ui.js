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

//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function twitterDisplay(data, service) {
    //Build the interface for the twitter block and add css property
    var content = $('<div/>');
    content.css({ "margin-bottom": "4%" })
    content.addClass("ui-widget ui-widget-content");
    var header = $("<div/>");
    header.addClass("ui-widget-header singly-content-header ui-corner-all");
    header.append(service.toUpperCase());
    content.append(header);
    var table = $("<table/>");
    var rowFriends = $("<tr/>");
    var rowMentions = $("<tr/>");
    var rowTweets = $("<tr/>");
    var rowTimeline = $("<tr/>");
    rowFriends.append($("<td/>").addClass("singly-content-label").append("Friends :"));
    rowFriends.append($("<td/>").append(data.friends));
    rowMentions.append($("<td/>").addClass("singly-content-label").append("Mentions :"));
    rowMentions.append($("<td/>").append(data.mentions));
    rowTweets.append($("<td/>").addClass("singly-content-label").append("Tweets :"));
    rowTweets.append($("<td/>").append(data.tweets));
    rowTimeline.append($("<td/>").addClass("singly-content-label").append("Timeline :"));
    rowTimeline.append($("<td/>").append(data.timeline));
    table.append(rowFriends);
    table.append(rowMentions);
    table.append(rowTweets);
    table.append(rowTimeline);
    content.append(table);
    //Add to the Default page left block
    $("#contentLeft").append(content);
    //Update the scrollbar
    $("#content").tinyscrollbar_update();
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function twitterDisplaySelf(data, service) {
    //Build the interface for the twitter self block and add css property
    var content = $('<div/>');
    content.css({ "margin-bottom": "4%" })
    content.addClass("ui-widget ui-widget-content");
    var header = $("<div/>");
    header.addClass("ui-widget-header singly-content-header ui-corner-all");
    header.append(service.toUpperCase() + "-" + data[0]["data.name"]);
    var inside = $('<div/>');
    inside.css({ "padding": 5, "position": "relative" });
    content.append(header);
    var profilePicture = $("<img/>");
    profilePicture.attr("src", data[0]["data.profile_image_url"]);
    profilePicture.attr("alt", data[0]["data.name"]);
    profilePicture.attr("title", data[0]["data.name"]);
    profilePicture.addClass("ui-corner-all");
    profilePicture.css({ "position": "absolute", "right": 10 });
    inside.append(profilePicture);
    inside.append($("<span/>").addClass("singly-content-label").append("Description :"));
    inside.append("</br>");
    inside.append($("<div/>").css({ "width": 430, "word-wrap": "break-word" }).append(data[0]["data.description"]));
    inside.append("</br>");
    inside.append("</br>");
    inside.append($("<span/>").addClass("singly-content-label").append("Last Tweet :"));
    inside.append("</br>");
    inside.append($("<div/>").css({ "width": 430, "word-wrap": "break-word" }).append(data[0]["data.status.text"]));
    inside.append("</br>");
    inside.append("</br>");
    inside.append($("<div/>").addClass("singly-content-separator").append(" "));
    content.append(inside);
    //Build the chart data
    var dataPeople = google.visualization.arrayToDataTable([
        ['People', 'Number'],
        ['Followers', data[0]["data.followers_count"]],
        ['Followings', data[0]["data.friends_count"]]
    ]);
    var options = { title: 'My People',
        chartArea: { width: '100%', height: '70%', left: '0', top: '15' }
    };
    var piePeopleContainer = $('<div/>');
    piePeopleContainer.attr("id", "piePeopleContainer");
    piePeopleContainer.css({ "width": 200, "height": 140, "margin-left": 10, "float": "left" });
    content.append(piePeopleContainer);
    var statsTweetContainer = $('<div/>');
    statsTweetContainer.attr("id", "statsTweetContainer");
    statsTweetContainer.css({ "width": 320, "height": 140, "margin-left": 10, "float": "left" });
    content.append(statsTweetContainer);
    content.append($("<div/>").css({ "clear": "left" }));
    $("#contentCenter").append(content);
    //Create the pie followers/followings
    var chart = new google.visualization.PieChart(document.getElementById('piePeopleContainer'));
    chart.draw(dataPeople, options);
    //Call another request for more statistics
    callRequest("GET", "https://api.singly.com/v0/services/twitter/tweets", { "fields": "data.created_at", "limit": "500" }, "twitter", twitterDisplayStatsTweet);
    $("#content").tinyscrollbar_update();
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function twitterDisplayStatsTweet(data, service) {
    var statsTweetContainer = $('#statsTweetContainer');
    var datesArray = new Array;
    //Build the chart data
    for (var i = 0; i < data.length; i++) {
        datesArray.push(new Date(data[i]["data.created_at"]).setHours(0, 0, 0, 0));
    }
    var statsArray = new Array;
    var pivotDate = datesArray[0];
    var counter = 0;
    for (var i = 0; i < datesArray.length; i++) {
        if (pivotDate == datesArray[i]) {
            counter += 1;
        }
        else {
            var stat = new Object;
            stat.date = pivotDate;
            stat.value = counter;
            statsArray.push(stat);
            pivotDate = datesArray[i];
            counter = 1;
        }
    }
    var dataStats = new google.visualization.DataTable();
    dataStats.addColumn('date', 'Date');
    dataStats.addColumn('number', 'Tweets');
    for (var i = 0; i < statsArray.length; i++) {
        dataStats.addRow([new Date(statsArray[i].date), parseInt(statsArray[i].value)]);
    }
    var options = {
        title: 'My Tweets Flow',
        hAxis: { title: 'Date' },
        chartArea: { width: '98%', height: '70%', left: '20', top: '15' },
        legend: { position: "none" }
    };
    //Display the tweet creation per date
    var chart = new google.visualization.AreaChart(document.getElementById('statsTweetContainer'));
    chart.draw(dataStats, options);
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function facebookDisplay(data, service) {
    //Build the interface for the facebook block and add css property
    var content = $('<div/>');
    content.css({ "margin-bottom": "4%" })
    content.addClass("ui-widget ui-widget-content");
    var header = $("<div/>");
    header.addClass("ui-widget-header singly-content-header ui-corner-all");
    header.append(service.toUpperCase());
    content.append(header);
    $("#contentFacebook").append(content);
    var table = $("<table/>");
    var rowFriends = $("<tr/>");
    var rowHomePhotos = $("<tr/>");
    var rowFeeds = $("<tr/>");
    var rowWall = $("<tr/>");
    rowFriends.append($("<td/>").addClass("singly-content-label").append("Friends :"));
    rowFriends.append($("<td/>").append(data.friends));
    rowHomePhotos.append($("<td/>").addClass("singly-content-label").append("Home Photos :"));
    rowHomePhotos.append($("<td/>").append(data.home_photos));
    rowFeeds.append($("<td/>").addClass("singly-content-label").append("Feeds :"));
    rowFeeds.append($("<td/>").append(data.feed));
    rowWall.append($("<td/>").addClass("singly-content-label").append("Wall :"));
    rowWall.append($("<td/>").append(data.home));
    table.append(rowFriends);
    table.append(rowHomePhotos);
    table.append(rowFeeds);
    table.append(rowWall);
    content.append(table);
    //Add to the Default page left block
    $("#contentLeft").append(content);
    //Update the scrollbar
    $("#content").tinyscrollbar_update();
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function facebookDisplaySelf(data, service) {
    //Build the interface for the facebook self block and add css property
    var content = $('<div/>');
    content.css({ "margin-bottom": "4%" })
    content.addClass("ui-widget ui-widget-content");
    var header = $("<div/>");
    header.addClass("ui-widget-header singly-content-header ui-corner-all");
    header.append(service.toUpperCase() + "-" + data[0]["data.name"]);
    var inside = $('<div/>');
    inside.css({ "padding": 5, "position": "relative" });
    content.append(header);
    var profilePicture = $("<img/>");
    profilePicture.attr("src", "https://graph.facebook.com/" + data[0]["data.id"] + "/picture?type=large");
    profilePicture.attr("alt", data[0]["data.name"]);
    profilePicture.attr("title", data[0]["data.name"]);
    profilePicture.addClass("ui-corner-all");
    profilePicture.css({ "position": "absolute", "right": 10, "height": 74 });
    inside.append(profilePicture);
    content.append(inside);
    inside.append($("<div/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).addClass("singly-content-label").append("Name :"));
    inside.append($("<div/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).addClass("singly-content-label").append("Gender :"));
    inside.append("</br>");
    inside.append($("<div/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).append(data[0]["data.name"]));
    inside.append($("<div/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).append(data[0]["data.gender"]));
    inside.append("</br>");
    inside.append($("<span/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).addClass("singly-content-label").append("Hometown :"));
    inside.append($("<span/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).addClass("singly-content-label").append("Location :"));
    inside.append("</br>");
    inside.append($("<div/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).append(data[0]["data.hometown.name"]));
    inside.append($("<div/>").css({ "width": 150, "word-wrap": "break-word", "float": "left" }).append(data[0]["data.location.name"]));
    inside.append("</br>");
    inside.append("</br>");
    inside.append($("<div/>").addClass("singly-content-separator").append(" "));
    content.append(inside);
    var photoContainer = $("<div/>");
    photoContainer.attr("id", "photoContainer");
    photoContainer.css({ "height": 150});
    content.append(photoContainer);
    $("#contentCenter").append(content);
    //Call antoher request to get Facebook User Photo
    callRequest("GET", "https://api.singly.com/v0/services/facebook/photos", { "fields": "data.picture,data.source,data.height,data.width,data.likes",
        "limit": "20"
    }, "facebook", facebookDisplayPhoto);
    $("#content").tinyscrollbar_update();
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function facebookDisplayPhoto(data, service) {
    //Build the user pictures display
    $("#photoContainer").append($("<div/>").addClass("singly-content-label").append("Last Photos"));
    $("#photoContainer").append($("<br/>"));
    var scrollbar = $("<div/>").addClass("scrollbar");
    var track = $("<div/>").addClass("track");
    var thumb = $("<div/>").addClass("thumb");
    var end = $("<div/>").addClass("end");
    thumb.append(end);
    track.append(thumb);
    scrollbar.append(track);
    $("#photoContainer").append(scrollbar);
    var viewport = $("<div/>").addClass("viewport");
    var overview = $("<div/>").addClass("overview");
    viewport.append(overview);
    $("#photoContainer").append(viewport);
    var content = $('<div/>').css({"white-space":"nowrap"});
    for (var i = 0; i < data.length; i++) {
        var photo = $("<img/>");
        photo.attr("src", data[i]["data.picture"]);
        photo.css({"height":80,"margin":2})
        content.append(photo);
    }
    overview.append(content);
    $("#photoContainer").tinyscrollbar({ axis: 'x', scroll: false });
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function linkedinSelf(data, service) {
    //Build the interface for the linkedin self block and add css property
    var content = $('<div/>');
    content.css({ "margin-bottom": "4%" })
    content.addClass("ui-widget ui-widget-content");
    var header = $("<div/>");
    header.addClass("ui-widget-header singly-content-header ui-corner-all");
    header.append(service.toUpperCase());
    content.append(header);
    var table = $("<table/>");
    var rowPicNames1 = $("<tr/>");
    var rowPicNames2 = $("<tr/>");
    var rowIndustry = $("<tr/>");
    var rowHeadLine = $("<tr/>");
    cellPicture = $("<td/>");
    cellPicture.attr("rowspan", 3);
    cellPicture.append($("<img/>").attr("src", data[0].data.pictureUrl))
    rowPicNames1.append(cellPicture);
    rowPicNames1.append($("<td/>").append(data[0].data.firstName));
    rowPicNames2.append($("<td/>").append(data[0].data.lastName));
    rowIndustry.append($("<td/>").append(data[0].data.industry));
    rowHeadLine.append($("<td/>").attr("colspan", 2).append(data[0].data.headline));
    table.append(rowPicNames1);
    table.append(rowPicNames2);
    table.append(rowIndustry);
    table.append(rowHeadLine);
    content.append(table);
    $("#contentLeft").append(content);
    $("#content").tinyscrollbar_update();
}