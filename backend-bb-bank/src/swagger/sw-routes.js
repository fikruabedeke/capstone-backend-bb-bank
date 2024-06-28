/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAccount:
 *       type: object
 *       required:
 *         - userName
 *         - userEmail
 *         - userpassword
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated id given to the account during account creation 
 *         userName:
 *           type: string
 *           description: user name given by the user when creating an account
 *         userEmail:
 *           type: string
 *           description: the user email given by the user when creacting the account
 *         userpassword:
 *           type: string
 *           description: user password given by the user
 *         userAddedDateTimeZ:
 *           type: string
 *           description: system created ISO date time generated during creact creation
 *       example:
 *         _id: 667837916a9180c9d6021000
 *         userName: Fikru A. Bedeke
 *         userEmail: fikrubedeke@gmail.com
 *         userAddedDateTimeZ: 2020-03-10T04:05:06.157Z
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: the user email given by the user when creacting the account
 *         password:
 *           type: string
 *           description: user password given by the user
 *       example:
 *         email: fikrubedeke@gmail.com
 *         password: mypassword
 *     Deposit:
 *       type: object
 *       required:
 *         - amount
 *         - currencyUnit
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id for deposit transaction
 *         amount:
 *           type: int
 *           description: the amount user deposits to account
 *         currencyUnit:
 *           type: string
 *           description: the currency unit of deposit
 *         depositDateTimeZ:
 *           type: string
 *           description: system generated ISO date time generated during deposit
 *       example:
 *         _id: 667837916a9180c9d6021000
 *         amount: 20
 *         currencyUnit: USD
 *         depositDateTimeZ: 2020-03-10T04:05:06.157Z
 *     Withdraw:
 *       type: object
 *       required:
 *         - amount
 *         - currencyUnit
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id during deposit 
 *         amount:
 *           type: int
 *           description: the amount user deposits to account
 *         currencyUnit:
 *           type: string
 *           description: the currency unit user to withdraw from account
 *         withdrawalDateTimeZ:
 *           type: string
 *           description: system generated ISO date time value
 *       example:
 *         _id: 667837916a9180c9d6021000
 *         amount: 20
 *         currencyUnit: USD
 *         withdrawalDateTimeZ: 2020-03-10T04:05:06.157Z
 *     Balance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id during deposit 
 *         ownerName:
 *           type: string
 *           description: account owner name
 *         currencyUnit:
 *           type: string
 *           description: the amount user deposits to account
 *         currrentBalance:
 *           type: int
 *           description: current balance in the account
 *       example:
 *         _id: 667837916a9180c9d6021000
 *         ownerName: fikrubedke@gmail.com
 *         currencyUnit: USD
 *         currentBalance: 100
 *     AllData:
 *       type: object
 *       required:
 *       properties:
 *         accountInfo:
 *           type: object
 *           description: accout info object 
 *         balance:
 *           type: object
 *           description: account balance object
 *         deposit:
 *           type: array
 *           description: deposit array object
 *         withdrwal:
 *           type: array
 *           description: withdrwal array object
 */
/**
 * @swagger
 * tags:
 *   - name: CreateAccount
 *     description: User creation API
 *   - name: Login
 *     description: User Login API
 *   - name: Deposit
 *     description: Deposit to account API
 *   - name: Withdraw
 *     description: API for withdrawal from account
 *   - name: Balance
 *     description: API for getting account balance API
 *   - name: AllData
 *     description: API for fetching all data from account
 * /account/create:
 *   post:
 *     summary: Create a new account
 *     tags: [CreateAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccount'
 *     responses:
 *       200:
 *         description: create user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAccount'
 *       500:
 *         description: Some server error
 * /account/login:
 *   post:
 *     summary: login to account
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The logged in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       404:
 *         description: user not found
 *       500:
 *         description: Some server error
 * /account/deposit:
 *   post:
 *     summary: deposit to the account
 *     tags: [Deposit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deposit'
 *     responses:
 *       200:
 *         description: The logged in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deposit'
 *       404:
 *         description: user not found
 *       500:
 *         description: Some server error
 * /account/withdraw:
 *   post:
 *     summary: withdraw from the account
 *     tags: [Withdraw]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Withdraw'
 *     responses:
 *       200:
 *         description: The logged in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Withdraw'
 *       404:
 *         description: user not found
 *       500:
 *         description: Some server error
 * /account/balance/{id}:
 *   get:
 *     summary: Get account balance by id
 *     tags: [Balance]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email id
 *     responses:
 *       200:
 *         description: Account balance response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Balance'
 *       404:
 *         description: The account was not found
 *       500:
 *         description: Some server error
 * /account/alldata/{id}:
 *   get:
 *     summary: Get all data by id
 *     tags: [AllData]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email id
 *     responses:
 *       200:
 *         description: Get all data response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllData'
 *       404:
 *         description: Account was not found
 *       500:
 *         description: Some server error
 */