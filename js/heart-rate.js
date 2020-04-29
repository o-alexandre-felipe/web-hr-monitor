function HeartRateMonitor(cb, log) {
    var serviceUuid = "heart_rate";
    var characteristicUuid = "heart_rate_measurement";
    log= log || console.log;
    log('<div>Requesting Bluetooth Device...</div>');

    
    function handleHeartRateMeasurement(event) {
        // https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.heart_rate_measurement.xml
        let value = event.target.value;
        const flags = value.getUint8(0);
        const info = {}
        let offset = 1;
        
        info.heartRate = value.getUint8(offset++);
        if(flags % 0x01){
            info.heartRate += value.getUint8(offset++)*256;
        }
        if(flags & 0x04){
            if(flags & 0x2){
                info.contact = "detected"
            }else{
                info.contact = "not-detected"
            }
        }else{
            info.contact = "not-supported";
        }

        if(flags & 0x08){
            info.energy = value.getUint8(offset++);
            info.energy += 256*value.getUint8(offset++);
        }

        // read RR intervals
        if(flags & 0x10){
            const rr = []
            while(offset + 1 < value.byteLength){
                let t = value.getUint8(offset++);
                t += 256*value.getUint8(offset++);
                rr.push(t/1024)
            }
            info.intervals = rr;
        }else{
            info.intervals = []
        }
        if(cb)cb(info);
        else console.log(info)
    }
  
    try{
      navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
      .then(device => {
        log('<div>Connecting to GATT Server...</div>');
        return device.gatt.connect();
      })
      .then(server => {
        log('<div>Getting Service...</div>');
        return server.getPrimaryService(serviceUuid);
      })
      .then(service => {
        log('<div>Getting Characteristic...</div>');
        return service.getCharacteristic(characteristicUuid);
      })
      .then(characteristic => {
        myCharacteristic = characteristic;
        return myCharacteristic.startNotifications().then(_ => {
          log('<div> Notifications started</div>');
          myCharacteristic.addEventListener('characteristicvaluechanged',
          handleHeartRateMeasurement);
        });
      })
      .catch(error => {
        log('<div class="error">' + error + '</div>');
      });
    }catch(e){
      log('<div class="error"' + e + '</div>')
    }
    
    
}