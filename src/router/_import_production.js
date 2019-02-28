module.exports = file => () => {
  try {
    return import('@/views/' + file + '.vue')
  } catch (err) {
    console.log(err)
  }
}

