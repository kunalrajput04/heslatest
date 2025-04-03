function GetMap() {
  var localStoragedetails = localStorage;
  let token = localStoragedetails.apikey;
  let UserID = localStoragedetails.UserID;
  let levelName = localStoragedetails.levelName;
  let levelValue = localStoragedetails.levelValue;

  var mydata = {
    levelValue: levelValue,
    levelName: levelName,
  };

  $.ajax({
    url: "https://meghasmarts.com:8443/dlms/rest/Evit/dashboardDetails/",
    crossDomain: true,
    type: "POST",
    // host: "115.124.96.29:8081",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(mydata),
    dataType: "json",
    headers: {
      apikey: token,
    },

    success: function (r) {

      var res = r["data"];
      var deviceSrNo = res["DEVICE"];
      var consumerno = res["CRN"];
      var ipv6 = res["NICIP"];
      var loadstatus = res["METERTYPE"];
      var lattitude = res["LATITUDE"];
      var longitude = res["LONGITUDE"];
      var deviceType = res["DEVICE_TYPE"];
      var ccmsstatus = res["STATUS"];
      var consumer = res["CONSUMER_NAME"];
      var subdivision = res["SUBDIVISION"];
      var feeder = res["FEEDER"];
      var substation = res["SUBSTATION"];
      var dt = res["DT"];
      var gprs = 'GPRS';
      var planes = [];
      for (var i = 0; i < lattitude.length; i++) {
        var arr = [deviceSrNo[i], lattitude[i], longitude[i]];
        planes.push(arr);
      }
      var markers = L.markerClusterGroup();
      if (lattitude.length > 0) {
        var map = L.map("map").setView([lattitude[0], longitude[0]], 9);
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; " + mapLink + " Contributors",
          minZoom: 0,
        }).addTo(map);

        var LeafIcon = L.Icon.extend({
          options: {
            iconSize: [40, 40],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
          },
        });

        var subdivisionimg = new LeafIcon({
          iconUrl: "assets/images/subdivisionimg.png",
        }),
          feederimg = new LeafIcon({
            iconUrl: "assets/images/feederimg.png",
          }),
          substationimg = new LeafIcon({
            iconUrl: "assets/images/substationimg.png",
          }),
          dtimg = new LeafIcon({ iconUrl: "assets/images/dtimg.png" }),
          deviceimg = new LeafIcon({
            iconUrl: "assets/images/deviceimg.png",
          });

        L.icon = function (options) {
          return new L.Icon(options);
        };
        for (var i = 0; i < planes.length; i++) {
          if (planes[i][1] != "null" && planes[i][1] != "-" && planes[i][1] != "--" && planes[i][1] != "NaN" && planes[i][2] != "null" && planes[i][2] != "-" && planes[i][2] != "--" && planes[i][2] != "NaN") {
            if (deviceType[i] == "METER") {
              var marker = L.marker([planes[i][1], planes[i][2]], {
                icon: deviceimg,
              });
              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                "<b>CONSUMER NUMBER :</b>" +
                consumerno[i] +
                "<br><b>CONSUMER NAME :</b>" +
                consumer[i] +
                "<br><b>METER S.NO :</b> " +
                deviceSrNo[i] +
                "<br><b>NIC TYPE :</b> " +
                gprs +
                "<br><b>NIC IPV6 :</b>" +
                ipv6[i] +
                "<br><b>LOAD STATUS :</b>" +
                loadstatus[i] +
                "<br><b>STATUS :</b>" +
                ccmsstatus[i] +
                "<br><b>SUBDIVISION :</b>" +
                subdivision[i] +
                "<br><b>SUBSTATION :</b>" +
                substation[i] +
                "<br><b>FEEDER :</b>" +
                feeder[i] +
                "<br><b>DT :</b>" +
                dt[i] +
                "<br><b>LATITUDE :</b> " +
                lattitude[i] +
                "<br><b>LONGITUDE :</b> " +
                longitude[i] +
                "</div>";
              marker.bindPopup(title);
              markers.addLayer(marker);

            } else if (deviceType[i] == "SUBDIVISION") {
              var marker = L.marker([planes[i][1], planes[i][2]], {
                icon: subdivisionimg,
              });

              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                "<b>" +
                deviceType[i] +
                " NAME :</b> " +
                deviceSrNo[i] +
                "<br><b>LATITUDE :</b> " +
                lattitude[i] +
                "<br><b>LONGITUDE :</b> " +
                longitude[i] +
                "</div>";
              marker.bindPopup(title);
              markers.addLayer(marker);
            } else if (deviceType[i] == "FEEDER") {
              var marker = L.marker([planes[i][1], planes[i][2]], {
                icon: feederimg,
              });

              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                "<b>" +
                deviceType[i] +
                " NAME :</b> " +
                deviceSrNo[i] +
                "<br><b>LATITUDE :</b> " +
                lattitude[i] +
                "<br><b>LONGITUDE :</b> " +
                longitude[i] +
                "</div>";
              marker.bindPopup(title);
              markers.addLayer(marker);
            } else if (deviceType[i] == "SUBSTATION") {
              var marker = L.marker([planes[i][1], planes[i][2]], {
                icon: substationimg,
              });

              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                "<b>" +
                deviceType[i] +
                " NAME :</b> " +
                deviceSrNo[i] +
                "<br><b>LATITUDE :</b> " +
                lattitude[i] +
                "<br><b>LONGITUDE :</b> " +
                longitude[i] +
                "</div>";
              marker.bindPopup(title);
              markers.addLayer(marker);
            } else if (deviceType[i] == "DT") {
              var marker = L.marker([planes[i][1], planes[i][2]], {
                icon: dtimg,
              });

              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                "<b>" +
                deviceType[i] +
                " NAME :</b> " +
                deviceSrNo[i] +
                "<br><b>LATITUDE :</b> " +
                lattitude[i] +
                "<br><b>LONGITUDE :</b> " +
                longitude[i] +
                "</div>";
              marker.bindPopup(title);
              markers.addLayer(marker);
            }
          }
        }
        map.addLayer(markers);
      }
    },
    falied: function (r) {
      alert(r);
    },
  });
}
