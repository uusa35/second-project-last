describe('Navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');

    // select area
    cy.get('[data-cy="selectLocation"]').contains('select location').click();
    cy.url().should('contains', '/cart/delivery/select');
    cy.get('[data-cy="accordion"]').eq(0).click();
    // click first element
    cy.get('[data-cy="area"] > span').eq(0).click();
    cy.get('[data-cy="confirm"]').click();

    // shuld click on category or item
    it('check if it render items or categories', () => {
      // RERUN THIS TEST OVER AND OVER AGAIN
      // AND IT WILL SOMETIMES BE TRUE, AND
      // SOMETIMES BE FALSE.
      cy.get('[data-cy="items"]').then(($items) => {
        if ($items.should('exist')) {
          // items is rendered in home
        } else {
          // categories is rendered in home
          cy.get('[data-cy="category"]').contains('Yellow Flowers').click();
          cy.url().should(
            'contains',
            '/category/2/delivery/23?slug=yellow-flowers&page=1&limit=10'
          );
          cy.get('[data-cy="product"]').contains('Wedding Bouquet').click();
          cy.url().should(
            'contains',
            '/product/show/6?product_id=6&slug=wedding%20bouquet&branchId=&areaId=23&category_id=2'
          );
        }
      });
    });

    // cy.get('[data-cy="category"]').contains('Yellow Flowers').click();
    // cy.url().should(
    //   'contains',
    //   '/category/2/delivery/23?slug=yellow-flowers&page=1&limit=10'
    // );
    // cy.get('[data-cy="product"]').contains('Wedding Bouquet').click();
    // cy.url().should(
    //   'contains',
    //   '/product/show/6?product_id=6&slug=wedding%20bouquet&branchId=&areaId=23&category_id=2'
    // );
    cy.get('[data-cy="increase-product"]').click();
    cy.get('[data-cy="increase-addon"]').eq(0).contains('+').click();
    cy.get('[data-cy="start-order"]').contains('add to cart').click();
    cy.get('[data-cy="shopping-cart"]').click();
    cy.url().should('contains', '/cart');

    cy.get('[data-cy="net-total"]')
      .invoke('val')
      .then((total) => {
        cy.log('total', total);

        cy.get('[data-cy="sub-total"]')
          .invoke('val')
          .then((subTotal) => {
            cy.log('subTotal', subTotal);

            cy.get('[data-cy="deliveryFees"]')
              .invoke('val')
              .then((deliveryFees) => {
                cy.log('deliveryFees', deliveryFees);
                // cy.wrap(add(1, 2)).should('equal', 3)
                // const num1 = parseFloat($span.text())
              });
          });
      });

    // const total = cy.get('[data-cy="net-total"]');
    // const subTotal = cy.get('[data-cy="sub-total"]');
    // const deliveryFees = cy.get('[data-cy="deliveryFees"]');
    // cy.log(`${total}`);
    // cy.log(`${subTotal}`);
    // cy.log(`${deliveryFees}`);
    // const fn = (a: number, b: number) => {
    //   return a + b
    // }

    // cy.wrap({ sum: fn })
    //   .invoke('sum', subTotal, deliveryFees)
    //   .should('be.eq', total)
  });
});
export {};
