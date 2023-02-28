describe('Navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="selectLocation"]').contains('select location').click();
    cy.url().should('contains', '/cart/delivery/select');
    cy.get('[data-cy="accordion"]').eq(0).click();
    cy.get('[data-cy="area"]').contains('Funaitees').click();
    cy.get('[data-cy="confirm"]').click();
    cy.get('[data-cy="category"]').contains('Yellow Flowers').click();
    cy.url().should('contains', '/category/2/delivery/23?slug=yellow-flowers&page=1&limit=10');
    cy.get('[data-cy="product"]').contains('Wedding Bouquet').click();
    cy.url().should('contains', '/product/show/6?product_id=6&slug=wedding%20bouquet&branchId=&areaId=23&category_id=2');
    cy.get('[data-cy="increase-product"]').click();
    cy.get('[data-cy="increase-addon"]').eq(0).contains('+').click();
    cy.get('[data-cy="start-order"]').contains('add to cart').click();
    cy.get('[data-cy="shopping-cart"]').click();
    cy.url().should('contains', '/cart');
    const total = cy.get('[data-cy="net-total"]');
    const subTotal = cy.get('[data-cy="sub-total"]');
    const deliveryFees = cy.get('[data-cy="deliveryFees"]');
    cy.log(`${total}`);
    cy.log(`${subTotal}`);
    cy.log(`${deliveryFees}`);
    const fn = (a: number, b: number) => {
      return a + b 
    }
    
    cy.wrap({ sum: fn })
      .invoke('sum', subTotal, deliveryFees)
      .should('be.eq', total) 
  })
});
export {}