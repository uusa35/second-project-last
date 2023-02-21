// import { useTranslation } from "react-i18next";
// const { t } = useTranslation();

describe('Navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="category"]').contains('Yellow Flowers').click();
    cy.url().should('contains', '/category/2?&slug=yellow-flowers&branch_id=&area_id=&page=1&limit=10');
    cy.get('[data-cy="product"]').contains('Wedding Bouquet').click();
    cy.url().should('contains', '/product/show/6?product_id=6&slug=wedding%20bouquet&branchId=&areaId=');
    cy.get('[data-cy="start-order"]').contains('start ordering').click();
    cy.url().should('contains', '/cart/delivery/select');
    cy.get('[data-cy="area"]').contains('Sabhan').click();
    cy.get('[data-cy="confirm"]').click();
    cy.url().should('contains', '/product/show/6?product_id=6&slug=wedding%20bouquet&branchId=&areaId=');
    cy.get('[data-cy="increase-product"]').click();
    cy.get('[data-cy="increase-addon"]').eq(0).contains('+').click();
    cy.get('[data-cy="start-order"]').contains('add to cart').click();
    cy.get('[data-cy="shopping-cart"]').click();
    cy.url().should('contains', '/cart');

    



  })
});
export {}