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

    cy.url().should('contains', 'http://localhost:3000');

    // shuld click on category or item
    cy.get('[data-cy="productCategoryContainer"]').then(($Container) => {
      cy.log('$items', $Container);
      if ($Container.find('[data-cy="items"]').length) {
        // items is rendered in home
        cy.get('[data-cy="items"]').children().eq(0).click();
        cy.location().should((loc) => {
          expect(loc.href).to.include('/product/show');
        });
      } else {
        // categories is rendered in home
        cy.get('[data-cy="category"]').eq(0).click();
        cy.url().should('contains', '/category');
        cy.get('[data-cy="product"]').eq(0).click();
        cy.url().should('contains', '/product/show');
      }
    });

    // cy.get('[data-cy="increase-product"]').click();
    // cy.get('[data-cy="increase-addon"]').eq(0).contains('+').click();
    // cy.get('[data-cy="start-order"]').contains('add to cart').click();
    // cy.get('[data-cy="shopping-cart"]').click();
    // cy.url().should('contains', '/cart');

    // cy.get('[data-cy="net-total"]')
    //   .invoke('val')
    //   .then((total) => {
    //     cy.log('total', total);

    //     cy.get('[data-cy="sub-total"]')
    //       .invoke('val')
    //       .then((subTotal) => {
    //         cy.log('subTotal', subTotal);

    //         cy.get('[data-cy="deliveryFees"]')
    //           .invoke('val')
    //           .then((deliveryFees) => {
    //             cy.log('deliveryFees', deliveryFees);
    //             // cy.wrap(add(1, 2)).should('equal', 3)
    //             // const num1 = parseFloat($span.text())
    //           });
    //       });
    //   });
  });
});
export {};
