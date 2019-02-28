module.exports = file => {
  try {
    return require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+
  } catch (err) {
    console.log(err)
  }
}

