    console.log("hey ik ben hier");

    var merchantID = 112339;
    var signatureKey = "Melt10Chest15File";
    var base64 = btoa(`${merchantID}:${signatureKey}`);

    let config = {
        headers: {
            Authorization: `Basic ${base64}`,
            'Content-Type': 'application/json'
        }
      }

    function createPayment() {
        axios.post("http://localhost:3000/createpayment")
            .then(({data}) => {
                console.log(data);
                if(data.statusCode == 200) {
                    window.location.href = data.url
                }

            })
            .catch(error => {
                console.log("Hey");
            }) 
    }