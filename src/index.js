let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch Andy's toys & add all info
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(toys => {
    toys.forEach((toy) => {
      // For each toy, create a div(.card) with h2, img, p and button elements
      let div = document.createElement('div')
      div.className = "card"

      let name = document.createElement('h2')
      name.textContent = toy["name"]

      let toyImage = document.createElement('img')
      toyImage.src = toy["image"]
      // Assigning className of toy-avatar to adopt defined properties in styles.css
      toyImage.className = "toy-avatar"

      let p = document.createElement('p')
      p.textContent = `${toy["likes"]} likes`

      let btn = document.createElement('button')
      btn.id = toy["id"]
      btn.className = "like-btn"
      btn.textContent = "Like ❤️"
      
      div.appendChild(name)
      div.appendChild(toyImage)
      div.appendChild(p)
      div.appendChild(btn)

      // Append the complete div to the toy-collection div
      document.querySelector('div#toy-collection').appendChild(div)
    })
  })

  // Add new toys to the collection using form
  let newInput = document.querySelector('form.add-toy-form')
  let createToy = newInput.querySelector('[name="submit"]')
  createToy.addEventListener('click', (e) => {
    e.preventDefault()
    let newName = newInput.querySelector('[name="name"]').value
    let newURL = newInput.querySelector('[name="image"]').value
    fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "name": newName,
      "image": newURL,
      "likes": 0
    })
  })
  .then(res => res.json())
  .then((toy) => {
      // we once again create a div(.card) with h2, img, p and button elements
      let div = document.createElement('div')
      div.className = "card"

      let name = document.createElement('h2')
      name.textContent = toy["name"]

      let toyImage = document.createElement('img')
      toyImage.src = toy["image"]
      toyImage.className = "toy-avatar"

      let p = document.createElement('p')
      p.textContent = `${toy["likes"]} likes`

      let btn = document.createElement('button')
      btn.id = toy["id"]
      btn.className = "like-btn"
      btn.textContent = "Like ❤️"
      
      div.appendChild(name)
      div.appendChild(toyImage)
      div.appendChild(p)
      div.appendChild(btn)

      // Append new toy to the div collection
      document.querySelector('div#toy-collection').appendChild(div)
      })
  })

  // Increase a toy's likes using patch
  // Had to set a timeout, otherwise the query returns a nodelist with length = 0.
  // I guess the timeout allows previous asynchronous fetches to complete and append to DOM before our query
  setTimeout(() => {
    const likeButtons = document.querySelectorAll(".like-btn")
    likeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        let toyId = button.id
        // For each button we get the number of likes by isolating the number for the string showing the likes
        let currentLikesString = button.previousElementSibling.textContent.replace(" likes", "")
        let currentLikes = parseInt(currentLikesString, 10)
        let newLikes = currentLikes +=1
  
        fetch(`http://localhost:3000/toys/${toyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body:JSON.stringify({
            "likes": newLikes
          })
        })
        .then(res => res.json())
        .then(toy => {
          button.previousElementSibling.textContent = `${toy["likes"]} likes`
        })
      })
    })
  }, 1000)
  });
