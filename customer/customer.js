let us = docLocalStorage();
if (us == null) {
    window.location.href = "../login/login.html";
}
let token = us.token;
let customerIdToDelete = null;

function showAllCustomer() {
    const user = JSON.parse(localStorage.getItem("user"));

    $.ajax({
        headers: {
            "Authorization": `Bearer ${user.token}`
        },
        method: "GET",
        url: "http://localhost:8081/api/customers",
        success: function (data) {
            if (data != null && data.length > 0) {
                let content = "";
                for (let i = 0; i < data.length; i++) {
                    let customer = data[i];
                    content += `<tr>
                        <td>${customer.name}</td>
                        <td>${customer.age}</td>
                        <td>${customer.gender}</td>
                        <td>${customer.address}</td>
                        <td>
                             <button class="btn btn-info" onclick="viewCustomer(${customer.id})">View</button>
                            <button class="btn btn-warning" onclick="showEditModal(${customer.id})">Edit</button>
                            <button class="btn btn-danger" onclick="showDeleteModal(${customer.id}, '${customer.name}')">Delete</button>
                           
                        </td>
                    </tr>`;
                }
                document.getElementById("content").innerHTML = content;
            } else {
                document.getElementById("content").innerHTML = "khong co du lieu";
            }
        }
    });
}

function showDeleteModal(id, name) {
    customerIdToDelete = id;
    $('#customerNameToDelete').text(name);
    $('#confirmDeleteModal').modal('show');
}

function deleteCustomer() {
    const user = JSON.parse(localStorage.getItem("user"));

    $.ajax({
        headers: {
            "Authorization": `Bearer ${user.token}`
        },
        method: "DELETE",
        url: `http://localhost:8081/api/customers/${customerIdToDelete}`,
        success: function () {
            $('#confirmDeleteModal').modal('hide');
            showAllCustomer();
        }
    });
}

function showAddModal() {
    $('#customerModalLabel').text('Thêm mới khách hàng');
    $('#customerForm')[0].reset();
    $('#customerId').val('');
    $('#customerModal').modal('show');
}

function viewCustomer(id) {
    const user = JSON.parse(localStorage.getItem("user"));

    $.ajax({
        headers: {
            "Authorization": `Bearer ${user.token}`
        },
        method: "GET",
        url: `http://localhost:8081/api/customers/${id}`,
        success: function (data) {
            $('#customerModalLabel').text('Chi tiết khách hàng');
            $('#name').val(data.name).prop('disabled', true);
            $('#age').val(data.age).prop('disabled', true);
            $('#gender').val(data.gender).prop('disabled', true);
            $('#address').val(data.address).prop('disabled', true);
            $('#customerId').val(data.id);
            $('#customerModal').modal('show');
        }
    });
}

function showEditModal(id) {
    const user = JSON.parse(localStorage.getItem("user"));

    $.ajax({
        headers: {
            "Authorization": `Bearer ${user.token}`
        },
        method: "GET",
        url: `http://localhost:8081/api/customers/${id}`,
        success: function (data) {
            $('#customerModalLabel').text('Chỉnh sửa khách hàng');
            $('#name').val(data.name);
            $('#age').val(data.age);
            $('#gender').val(data.gender);
            $('#address').val(data.address);
            $('#customerId').val(data.id);
            $('#customerModal').modal('show');
        }
    });
}

$('#customerForm').submit(function (event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const customer = {
        name: $('#name').val(),
        age: $('#age').val(),
        gender: $('#gender').val(),
        address: $('#address').val()
    };
    const customerId = $('#customerId').val();

    if (customerId) {
        // Update existing customer
        $.ajax({
            headers: {
                "Authorization": `Bearer ${user.token}`
            },
            method: "PUT",
            url: `http://localhost:8081/api/customers/${customerId}`,
            data: JSON.stringify(customer),
            contentType: "application/json",
            success: function () {
                $('#customerModal').modal('hide');
                showAllCustomer();
            }
        });
    } else {
        // Add new customer
        $.ajax({
            headers: {
                "Authorization": `Bearer ${user.token}`
            },
            method: "POST",
            url: "http://localhost:8081/api/customers",
            data: JSON.stringify(customer),
            contentType: "application/json",
            success: function () {
                $('#customerModal').modal('hide');
                showAllCustomer();
            }
        });
    }
});

$('#confirmDeleteButton').click(function () {
    deleteCustomer();
});

showAllCustomer();

function docLocalStorage() {
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    return user;
}
