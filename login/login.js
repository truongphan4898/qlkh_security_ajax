function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let user = {
        "username" : username,
        "password" : password
    }
    $.ajax({
        headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
        },
        method:'POST',
        data: JSON.stringify(user),
        url:"http://localhost:8081/api/auth/login",
        success:function (data){
            localStorage.setItem("user",JSON.stringify(data));
            window.location.href="../customer/customer.html"

        }

    })
}