const main = document.getElementById("main");
const tbody = document.getElementById("tbody");
const form = document.getElementById("form");
const btnAdd = document.querySelector(".btn-add");
const searchInput = document.getElementById("search");
const checkedList = [];

// Template Modal
const modals = document.getElementById("template-modal");
const modalLabel = document.getElementById("templateModalLabel");
const modalBody = document.querySelector(".modal-body");
const modalFoot = document.querySelector(".modal-footer");
const modal = new bootstrap.Modal(document.getElementById("template-modal"), {
  keyboard: false,
});

// Save to localstorage
const saveToLocalStorage = () => {
  localStorage.setItem("visitorLog", JSON.stringify(visitorLog));
};

// Load from localstorage
const loadFromLocalStorage = () => {
  const data = localStorage.getItem("visitorLog");
  return data ? JSON.parse(data) : [];
};

let visitorLog = loadFromLocalStorage();

// Modals Template
const buttonModal = () => {
  return `<button type="button" class="btn btn-submit btn-success">Save</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>`;
};

const titleModal = (title) => {
  return (textContent = title);
};

const submitForm = () => {
  document.querySelector(".btn-submit").addEventListener("click", () => {
    const name = document.querySelector("#name");
    const date = document.querySelector("#date");
    const reason = document.querySelector("#reason");

    if (name.value === "" || date.value === "" || reason.value === "") {
      return alert("Input tidak boleh kosong");
    }
    visitorLog.push({
      name: name.value,
      date: date.value,
      reason: reason.value,
    });

    render();
    saveToLocalStorage();

    const modal = bootstrap.Modal.getInstance(modals);
    modal.hide();
  });
};

const editForm = (index) => {
  document.querySelector(".btn-submit").addEventListener("click", () => {
    const name = document.querySelector("#name");
    const date = document.querySelector("#date");
    const reason = document.querySelector("#reason");

    if (name.value === "" || date.value === "" || reason.value === "") {
      return alert("Input tidak boleh kosong");
    }

    visitorLog[index] = {
      name: name.value,
      date: date.value,
      reason: reason.value,
    };

    render();
    saveToLocalStorage();

    const modal = bootstrap.Modal.getInstance(modals);
    modal.hide();
  });
};
// End Modals Template

// Modals
const modalAdd = () => {
  modalLabel.innerHTML = titleModal("Add New Visitor");

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-3">
        <label for="name" class="form-label">Name:</label>
      </div>
      <div class="col">
        <input type="text" id="name" name="name" class="form-control">
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-3">
        <label for="date" class="form-label">Date:</label>
      </div>
      <div class="col">
        <input type="date" id="date" name="date" class="form-control">
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-3">
        <label for="reason" class="form-label">Reason for Visit:</label>
      </div>
      <div class="col">
        <input type="text" id="reason" name="reason" class="form-control">
      </div>
    </div>
  `;

  modalFoot.innerHTML = buttonModal();

  submitForm();
};

const modalEdit = (data, index) => {
  modalLabel.innerHTML = titleModal("Edit Data");

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-3">
        <label for="name" class="form-label">Name:</label>
      </div>
      <div class="col">
        <input type="text" id="name" name="name" class="form-control" value="${data[index].name}">
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-3">
        <label for="date" class="form-label">Date:</label>
      </div>
      <div class="col">
        <input type="date" id="date" name="date" class="form-control" value="${data[index].date}">
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-3">
        <label for="reason" class="form-label">Reason for Visit:</label>
      </div>
      <div class="col">
        <input type="text" id="reason" name="reason" class="form-control" value="${data[index].reason}">
      </div>
    </div>
  `;

  modalFoot.innerHTML = buttonModal();
  editForm(index);
};

//End Modals

// Fungsi untuk memfilter data berdasarkan pencarian
const filterData = () => {
  const searchText = searchInput.value.toLowerCase();
  const filteredData = visitorLog.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchText) ||
      visitor.reason.toLowerCase().includes(searchText) ||
      visitor.date.toLowerCase().includes(searchText)
  );

  // Jika tidak ada hasil filter, tampilkan pesan
  if (filteredData.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='6' class='text-center'>There are no registered guests</td></tr>";
    return;
  }

  render(filteredData);
};

const render = (data = visitorLog) => {
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    tbody.innerHTML += `
    <tr>
      <td class="text-center">${index + 1}</td>
      <td class="name" data-id="${index}">${item.name}</td>
      <td class="date" data-id="${index}">${item.date}</td>
      <td class="reason" data-id="${index}">${item.reason}</td>
      <td>
        <input type="checkbox" data-id="${index}" class="form-control-checkbox">
      </td>
      <td>
        <button class="btn btn-edit btn-warning btn-sm" data-id="${index}">Edit</button>
        <button class="btn btn-delete btn-danger btn-sm" data-id="${index}">Delete</button>
      </td>
    </tr>
    `;
  });

  if (visitorLog.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='6' class='text-center'>Tidak ada tamu yang terdaftar</td></tr>";
  }
};

main.addEventListener("click", (e) => {
  const index = e.target.getAttribute("data-id");
  const checkboxes = document.querySelectorAll(".form-control-checkbox");
  let isChecked = e.target.checked;

  switch (true) {
    case e.target.classList.contains("btn-add"):
      modal.show();
      modalAdd();
      break;
    case e.target.classList.contains("select-all"):
      for (let checkbox of checkboxes) {
        checkbox.checked = isChecked;
        const id = checkbox.getAttribute("data-id");
        if (isChecked && !checkedList.includes(id)) {
          checkedList.push(id);
        } else if (!isChecked) {
          checkedList.splice(checkedList.indexOf(id), 1);
        }
      }
      console.log("Checked List:", checkedList);
      break;
    case e.target.classList.contains("btn-edit"):
      modal.show();
      modalEdit(visitorLog, index);
      break;
    case e.target.classList.contains("btn-delete"):
      const confirmation = confirm("Are you sure?");
      if (confirmation) {
        visitorLog.splice(index, 1);
        saveToLocalStorage();
        render();
      }
      break;
    case e.target.classList.contains("delete-all"):
      if (checkedList.length === 0) {
        alert("No items selected to delete.");
        return;
      }
      const deleteConfirmation = confirm(
        "Are you sure you want to delete all selected items?"
      );
      if (deleteConfirmation) {
        checkedList.sort((a, b) => b - a);
        for (let i = 0; i < checkedList.length; i++) {
          visitorLog.splice(checkedList[i], 1);
        }

        checkedList.length = 0;
        saveToLocalStorage();
        render();
      }
      break;
    case e.target.classList.contains("form-control-checkbox"):
      const allChecked = [...checkboxes].every((cb) => cb.checked);
      document.querySelector(".select-all").checked = allChecked;

      if (isChecked) {
        if (!checkedList.includes(parseInt(index))) {
          checkedList.push(parseInt(index));
        }
      } else {
        const itemIndex = checkedList.indexOf(parseInt(index));
        if (itemIndex !== -1) {
          checkedList.splice(itemIndex, 1);
        }
      }
      break;
    default:
      break;
  }
});

searchInput.addEventListener("input", filterData);
render();
