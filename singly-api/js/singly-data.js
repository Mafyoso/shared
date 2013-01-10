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

function callRequest(type, url, param, service, display) {
    //Use the Jquery Ajax function to call the server "proxy" function
    $.ajax({
        type: "POST",
        url: "http://test.singly.com/Default.aspx/proxy",
        data: JSON.stringify({ "url": url, "type": type, "param": JSON.stringify(param), "service": service }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.d) {
                //Result exists, call the callback display function
                display($.parseJSON(result.d), service);
            }
        },
        error: function (result) {
            var error = result 
        }
    });
}
