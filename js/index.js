const url = "https://reqres.in/api/users";

const tableBody = document.getElementById("tbody");
const form = document.getElementById("add-user-form");

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data);

    data.data.map((user) => {
      const { id, first_name, last_name, email, avatar } = user;

      const row = document.createElement("tr");

      row.innerHTML = `
    <td>${id}</td>
    <td>${first_name}</td>
    <td>${last_name}</td>
    <td>${email}</td>
    <td><img src=${avatar}></td>
    <td><button class = 'edit-button' data-id='${id}' data-name='${first_name}' data-lname='${last_name}' data-email='${email}'>Edit</button></td>
    <td><button class = 'delete-button' data-id='${id}' data-name='${first_name}' data-lname='${last_name}' data-email='${email}'>Delete</button></td>
        `;

      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.log(error));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("update-id").value;
  const name = document.getElementById("name").value;
  const lname = document.getElementById("lName").value;
  const email = document.getElementById("email").value;

  if (id) {
    updateUser(id, name, lname, email);
    form.reset();
  } else {
    const formData = {
      id: id,
      name: name,
      lname: lname,
      email: email,
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td>${data.lname}</td>
        <td>${data.email}</td>
        <td></td>
        <td><button class = 'edit-button' data-id='${data.id}' data-name='${data.name}' data-lname='${data.lname}' data-email='${data.email}'>Edit</button></td>
        <td><button class = 'delete-button' data-id='${data.id}' data-name='${data.name}' data-lname='${data.lname}' data-email='${data.email}'>Delete</button></td>
        `;

        tableBody.appendChild(row);

        form.reset();
      })
      .catch((error) => console.log(error));
  }
});

tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const lname = e.target.dataset.lname;
    const email = e.target.dataset.email;

    document.getElementById("update-id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("lName").value = lname;
    document.getElementById("email").value = email;
    document.querySelector("#save-user-button").textContent = "Update User";
  }

  if (e.target.classList.contains("delete-button")) {
    const id = e.target.dataset.id;

    deleteUser(id)
      .then(() => {
        const tableRow = e.target.closest("tr");
        tableRow.remove();
      })
      .catch((error) => console.log(error));
  }
});

async function deleteUser(id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "Delete",
    });
    if (response.ok) {
      return response;
    }
  } catch {
    (error) => console.log(error);
  }
}

async function updateUser(id, name, lname, email) {
  const formatData = {
    name: name,
    lname: lname,
    email: email,
  };

  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      body: formatData,
    });
    const data = await response.json();
    const tableRow = document.querySelectorAll("#tbody tr");
    console.log(tableRow);

    for (row of tableRow) {
      if (row.children[0].textContent === id.toString()) {
        row.children[1].textContent = name;
        row.children[2].textContent = lname;
        row.children[3].textContent = email;
      }
    }
    document.querySelector("#save-user-button").textContent = "Save";
    return data;
  } catch (error) {
    console.log(error);
  }
}
