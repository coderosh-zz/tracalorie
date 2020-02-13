// Storage Controller

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // Data Structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: () => data.items,
    addItem: (name, calories) => {
      let ID
      // Create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0
      }

      //   Calories to numbers
      calories = parseInt(calories)

      //   Create New Item
      let newItem = new Item(ID, name, calories)

      //   Add To Items array
      data.items.push(newItem)

      return newItem
    },
    getItemById: id => {
      let found = null

      data.items.forEach(item => {
        if (item.id === id) {
          found = item
        }
      })

      return found
    },
    updateItem: (name, calories) => {
      calories = parseInt(calories)

      let found = null

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name
          item.calories = calories
          found = item
        }
      })

      return found
    },
    setCurrentItem: item => {
      data.currentItem = item
    },
    getCurrentItem: () => data.currentItem,
    getTotalCalories: () => {
      let total = 0

      data.items.forEach(item => {
        total += item.calories
      })

      //   Set total cal in data structure
      data.totalCalories = total

      //   Return total
      return data.totalCalories
    },
    logData: () => data
  }
})()

// UIController
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: items => {
      let html = ''

      items.forEach(item => {
        html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>
        `
      })

      //   Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    getItemInput: () => ({
      name: document.querySelector(UISelectors.itemNameInput).value,
      calories: document.querySelector(UISelectors.itemCaloriesInput).value
    }),
    addListItem: item => {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // Create li element
      const li = document.createElement('li')
      li.className = 'collection-item'
      li.id = `item-${item.id}`

      // Add HTML
      li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
        `
      // INSERT ITEM
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li)
    },
    updateListItem: item => {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      //   Turn node list into array
      listItems = Array.from(listItems)

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id')

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `
        }
      })
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = ''
      document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },
    addItemToForm: () => {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories

      UICtrl.showEditState()
    },
    showTotalCalories: totalCalories => {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories
    },
    clearEditState: () => {
      UICtrl.clearInput()

      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    getSelectors: () => UISelectors
  }
})()

// App Controler
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = () => {
    const UISelectors = UICtrl.getSelectors()

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', ItemAddSubmit)

    //   Disable submit on enter
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault()
        return false
      }
    })

    //   Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick)

    //   Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit)
  }

  //  Add item submit
  const ItemAddSubmit = e => {
    //   Get Form Input From UICtrl
    const input = UICtrl.getItemInput()

    // Check for name an calories input
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      //   Add item to ui list
      UICtrl.addListItem(newItem)

      // Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      //   Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Clear fields
      UICtrl.clearInput()
    }

    e.preventDefault()
  }

  //   Item Update Submit
  const itemEditClick = e => {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id
      // Break into an array
      const listIdArr = listId.split('-')
      //   Get the actual id
      const id = parseInt(listIdArr[1])

      //   Get Item
      const itemToEdit = ItemCtrl.getItemById(id)

      // Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit)

      //   Ad item to form
      UICtrl.addItemToForm()
    }

    e.preventDefault()
  }

  const itemUpdateSubmit = e => {
    // Get item input
    const input = UICtrl.getItemInput()

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    // Update UI
    UICtrl.updateListItem(updatedItem)

    // Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    //   Add total calories to UI
    UICtrl.showTotalCalories(totalCalories)

    // Clear fields
    UICtrl.clearEditState()

    e.preventDefault()
  }

  return {
    init: () => {
      // Set Initial State
      UICtrl.clearEditState()

      const items = ItemCtrl.getItems()

      //   Check if any items
      if (items.length === 0) {
        UICtrl.hideList()
      } else {
        UICtrl.populateItemList(items)
      }

      // Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      //   Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Load event listeners
      loadEventListeners()
    }
  }
})(ItemCtrl, UICtrl)

// Initialize App
App.init()
