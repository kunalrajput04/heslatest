function GetMap() {
  const token = localStorage.getItem("apikey");
  const levelName = localStorage.getItem("levelName");
  const levelValue = localStorage.getItem("levelValue");

  const payload = { levelName, levelValue };

  $.ajax({
    url: "http://hesapi.mizopower.com:6005/api/v1/dashboard/dashboardDetails",
    crossDomain: true,
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(payload),
    dataType: "json",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },

    success: function (r) {
      const data = r?.data;
      if (!data || !data["DEVICE"] || !data["LATITUDE"] || !data["LONGITUDE"]) {
        $('#map').html('<p>No valid map data found.</p>');
        return;
      }

      const {
        DEVICE,
        LATITUDE,
        LONGITUDE,
        DEVICE_TYPE,
        NICIP,
        CONSUMER_NAME,
        SUBDIVISION,
        FEEDER,
        SUBSTATION,
        DT
      } = data;

      const planes = [];

      for (let i = 0; i < DEVICE.length; i++) {
        const lat = parseFloat(LATITUDE[i]);
        const lon = parseFloat(LONGITUDE[i]);
        if (!isNaN(lat) && !isNaN(lon)) {
          planes.push({ 
            serial: DEVICE[i],
            lat, 
            lon, 
            index: i,
            type: DEVICE_TYPE[i],
            ipv6: NICIP[i],
            consumer: CONSUMER_NAME[i],
            subDiv: SUBDIVISION[i],
            feeder: FEEDER[i],
            substation: SUBSTATION[i],
            dt: DT[i]
          });
        }
      }

      if (planes.length === 0) {
        $('#map').html('<p>No valid coordinates to display.</p>');
        return;
      }

      if (window.mapInstance) window.mapInstance.remove();

      const map = L.map("map").setView([planes[0].lat, planes[0].lon], 9);
      window.mapInstance = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(map);

      const LeafIcon = L.Icon.extend({
        options: { iconSize: [30, 30] }
      });

      const icons = {
        default: new LeafIcon({ iconUrl: "assets/images/deviceimg.png" }),
        subdivision: new LeafIcon({ iconUrl: "assets/images/subdivisionimg.png" }),
        feeder: new LeafIcon({ iconUrl: "assets/images/feederimg.png" }),
        substation: new LeafIcon({ iconUrl: "assets/images/substationimg.png" }),
        dt: new LeafIcon({ iconUrl: "assets/images/dtimg.png" })
      };

      const markers = L.markerClusterGroup();

      planes.forEach((point) => {
        let icon = icons.default;
        if (point.type === "SUBDIVISION") icon = icons.subdivision;
        else if (point.type === "FEEDER") icon = icons.feeder;
        else if (point.type === "SUBSTATION") icon = icons.substation;
        else if (point.type === "DT") icon = icons.dt;

        const popup = `
          <div style="font-size:14px; color:black;">
            <b>DEVICE:</b> ${point.serial}<br>
            <b>TYPE:</b> ${point.type}<br>
            <b>NIC IPV6:</b> ${point.ipv6}<br>
            <b>CONSUMER:</b> ${point.consumer}<br>
            <b>SUBDIVISION:</b> ${point.subDiv}<br>
            <b>FEEDER:</b> ${point.feeder}<br>
            <b>SUBSTATION:</b> ${point.substation}<br>
            <b>DT:</b> ${point.dt}<br>
            <b>LAT:</b> ${point.lat}<br>
            <b>LON:</b> ${point.lon}
          </div>
        `;

        const marker = L.marker([point.lat, point.lon], { icon });
        marker.bindPopup(popup);
        markers.addLayer(marker);
      });

      map.addLayer(markers);
    },

    error: function (err) {
      console.error("Map API error:", err);
      $('#map').html('<p>Error loading map data.</p>');
    }
  });
}
