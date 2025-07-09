var constraints = {
  confirmPassword: {
    equality: 'password'
  }
}

// validate(
//   { password: 'inputpassword', confirmPassword: 'inputpassword' },
//   constraints
// )
// => undefined

validate(
  { password: 'inputpassword', confirmPassword: 'verifpassword' },
  constraints
)
// => {confirmPassword: ["Confirm password is not equal to password"]}

constraints = {
  complexAttribute: {
    equality: {
      attribute: 'otherComplexAttribute',
      message: 'is not complex enough',
      comparator: function (v1, v2) {
        return JSON.stringify(v1) === JSON.stringify(v2)
      }
    }
  }
}

// validate(
//   { complexAttribute: [1, 2, 3], otherComplexAttribute: [1, 2, 3] },
//   constraints
// )
// // => undefined

// validate(
//   { complexAttribute: [1, 2, 3], otherComplexAttribute: [3, 2, 1] },
//   constraints
// )
// => {complexAttribute: ["Complex attribute is not complex enough"]}
