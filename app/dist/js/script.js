import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore,collection,addDoc,query,where,getDocs,getDoc,doc,updateDoc }from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCRdT7-RnE0UpB4c4p1HbqOKdMS55v1L8",
  authDomain: "novashop-a3f5d.firebaseapp.com",
  projectId: "novashop-a3f5d",
  storageBucket: "novashop-a3f5d.appspot.com",
  messagingSenderId: "1052634396408",
  appId: "1:1052634396408:web:710410484a8fb42866ed0d",
  measurementId: "G-JTV694ZMH4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)


fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {

        for (let product of products){
            document.getElementById("products").innerHTML += `
                <div class="card mx-auto" style="width: 18rem;">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <a class="btn btn-primary add-product" data-product='${product.id}'>Check</a>
                    </div>
                </div>
            `;
        }

        for (let el of document.getElementsByClassName("add-product")){

            el.onclick = async function(){
                const user = doc(db, "users", localStorage.getItem("user"));
                const data = await getDoc(user)


                const products = data.data().products || []
                const newProducts = new Set([...products, +this.dataset.id])

                await updateDoc(user, {
                    products: [...newProducts]
                });
                
                console.log("product added")
            }
        }

    })



document.getElementById("registerForm").onsubmit = async function(e){
    e.preventDefault();

    const name = document.getElementById("InputName").value;
    const email = document.getElementById("InputEmail").value;
    const password = document.getElementById("InputPassword1").value;
    const check = document.getElementById("Check1").value;

    await addDoc(collection(db, "users"), {name, email, password, check});

    console.log("works")
}


document.getElementById("LoginForm").onsubmit = async function(e){
    e.preventDefault();
    
    const email = document.getElementById("LoginInputEmail").value;
    const password = document.getElementById("LoginInputPassword").value;

    const q = query(collection(db,"users"), where("email", "==",email),where("password","==",password));
    
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => localStorage.getItem("user", doc.id));
    
    console.log("works")
}