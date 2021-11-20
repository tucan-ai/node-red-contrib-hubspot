
const pluralToSingular = {
  companies: 'company',
  contacts: 'contact',
  deals: 'deal',
  products: 'product',
  tickets: 'ticket',
  line_items: 'line_item',
  quotes: 'quote',
}

const singularToPlural = {}

Object.keys(pluralToSingular).forEach(plural => {
  singularToPlural[pluralToSingular[plural]] = plural
})

module.exports = {
  getPlural: (singular) => {
    if (singularToPlural[singular]) {
      throw new Error(`cannot find plural for ${singular}`)
    }

    return singularToPlural[singular]
  },
  getSingular: (plural) => {
    if (pluralToSingular[plural]) {
      throw new Error(`cannot find singular for ${plural}`)
    }

    return pluralToSingular[plural]
  }
}
