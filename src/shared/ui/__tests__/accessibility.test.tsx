import React from 'react';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Badge } from '../Badge';
import { Avatar } from '../Avatar';
import { Spinner } from '../Spinner';
import { EmptyState } from '../EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Chip } from '../Chip';
import { renderWithProviders } from '@/test/helpers';

describe('Global Design Primitives Accessibility Suite (WCAG via jest-axe)', () => {
  it('Button passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Button variant="primary" size="md">
        Confirm Purchase
      </Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Modal in open state passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Modal open={true} onClose={() => {}} title="Order Verification">
        <p>Your order is ready to be processed.</p>
      </Modal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Input with error passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Input
        label="Phone Number"
        error="Invalid mobile number provided"
        placeholder="+962 7 9000 0000"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Textarea passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Textarea
        label="Listing Details"
        hint="Provide complete description"
        placeholder="Write about the item..."
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Badge passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Badge variant="success">Verified Seller</Badge>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Avatar with status indicator passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Avatar fallback="SA" alt="Saleh Ahmad" status="online" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Spinner passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Spinner label="Loading marketplace listings" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('EmptyState passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <EmptyState
        title="No Saved Searches"
        description="You have not saved any search queries yet."
        action={<Button>Explore Categories</Button>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Card with compound elements passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Card>
        <CardHeader>
          <CardTitle>Special Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Discount available for Jordan users.</p>
        </CardContent>
      </Card>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Chip passes accessibility standards', async () => {
    const { container } = renderWithProviders(
      <Chip selected={true}>Filter Option</Chip>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
