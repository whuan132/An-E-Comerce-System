# CS571-2023-05-Extra-Project
# Extra Project
## Build an e-comerce system to satisfy the following conditions
* There are two types of users in the system, admin and customer.
1. Customers can do the following actions:
- Sign Up
- Sign In
- View list of products
- Add products to the cart
- Review/update the current products in the cart
- Place an order by using credit card or cash
- Check the status of the existing orders
- Return an order
- Add review for products

2. Admins can do the following actions:
- Sign In
- CRUD products
- View/Update orders
- View/disable a user
- Create an admin user

3. At the beginning, the system has an admin user
4. All passwords should be hashed
5. Use JWT for Authorization and Authentication
6. Only use the fundamental components with your own styles from React Native like: View, Text, Touchable*, button, Flatlist/ScrollView, TextInput, KeyboardAvoidingView, Image, ImageBackground
7. If you want to have the navigation, please use React Native Navigation: https://reactnavigation.org/
8. If you want to host a web component, please use webview: https://github.com/react-native-webview/react-native-webview
9. Do not use any styling UI kits like React Native Element...
10. You can upload the images to AWS storage - S3
## Technologies
* Backend: NodeJS Express, MongoDB
* Frontend: React Native
* Payment method: Stripe or anything you know
### Database
#### User
```JavaScript
{
    _id: ObjectId,
    email: String,
    password: String,
    role: String, //customer or admin,
    time: String,
    disable: Boolean, //A disable user cannot login to system
}
```
### Product
```JavaScript
{
    _id: ObjectId,
    name: String,
    images: String,
    category: String,
    price: Number,
    review: {
        score: Number, //average of all stars
        feedbacks: [
            {
                _id: ObjectId
                stars: Number,//1, 2, 3, 4, 5
                comment: String
            }
        ]
    },
    time: String,
}
```
### Order
```JavaScript
{
    _id: ObjectId,
    userId: ObjectId,
    products: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number, // sum of all (product.price * quantity)
    payment: String, //card or cash
    time: String,
    status: String, //ordered, delivered, or canceled
}
```
