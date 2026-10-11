import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SearchResultsScreen } from "../SearchResultsScreen";
import { useUIStore } from "@/store/ui.slice";
import { useListingsStore } from "@/features/listings/store/listings.slice";
import { createMockListing } from "@/test/helpers/mockListing";

describe("SearchResultsScreen Phase 3A regressions", () => {
  beforeEach(() => {
    useUIStore.setState({
      searchQuery: "",
      categoryFilter: null,
      subcategoryFilter: null,
      browseCountryCode: "JO",
      browseCityAr: "عمّان",
      browseCityEn: "Amman",
      minPriceFilter: null,
      maxPriceFilter: null,
      neighborhoodFilter: null,
      isArabic: false,
    });
    useListingsStore.setState({ listings: [], wishlist: [] });
  });

  it("preserves server-returned results even when client scoreListing would give score 0", () => {
    // Listing title/desc does NOT match query token "camry" client-side
    const serverResult = createMockListing({
      id: "srv-1",
      title: "Server Match 2022",
      description: "Returned by FTS RPC without client token",
      countryCode: "JO",
    });
    useListingsStore.setState({ listings: [serverResult] });
    useUIStore.setState({ searchQuery: "camry" });

    render(<SearchResultsScreen />);

    const countElement = screen.getByTestId("search-results-count");
    expect(countElement.textContent).toContain("1");
    expect(screen.getByText("Server Match 2022")).toBeDefined();
  });

  it("preserves market isolation (excludes listings from different countryCode)", () => {
    const joListing = createMockListing({
      id: "jo-1",
      title: "Jordan Car",
      countryCode: "JO",
    });
    const saListing = createMockListing({
      id: "sa-1",
      title: "Saudi Car",
      countryCode: "SA",
    });
    useListingsStore.setState({ listings: [joListing, saListing] });
    useUIStore.setState({ browseCountryCode: "JO", searchQuery: "Car" });

    render(<SearchResultsScreen />);

    const countElement = screen.getByTestId("search-results-count");
    expect(countElement.textContent).toContain("1");
    expect(screen.getByText("Jordan Car")).toBeDefined();
    expect(screen.queryByText("Saudi Car")).toBeNull();
  });

  it("preserves category, subcategory, and price filters", () => {
    const matchingListing = createMockListing({
      id: "match-1",
      title: "Motors Deal",
      categorySlug: "motors",
      subcategorySlug: "cars",
      price: "500",
      countryCode: "JO",
    });
    const wrongCategory = createMockListing({
      id: "wrong-cat",
      title: "Electronics Deal",
      categorySlug: "electronics",
      subcategorySlug: "phones",
      price: "500",
      countryCode: "JO",
    });
    const tooExpensive = createMockListing({
      id: "too-exp",
      title: "Expensive Motors Deal",
      categorySlug: "motors",
      subcategorySlug: "cars",
      price: "5000",
      countryCode: "JO",
    });

    useListingsStore.setState({
      listings: [matchingListing, wrongCategory, tooExpensive],
    });
    useUIStore.setState({
      browseCountryCode: "JO",
      searchQuery: "Deal",
      categoryFilter: "motors",
      maxPriceFilter: 1000,
    });

    render(<SearchResultsScreen />);

    const countElement = screen.getByTestId("search-results-count");
    expect(countElement.textContent).toContain("1");
    expect(screen.getByText("Motors Deal")).toBeDefined();
    expect(screen.queryByText("Electronics Deal")).toBeNull();
    expect(screen.queryByText("Expensive Motors Deal")).toBeNull();
  });

  it("preserves empty-query browsing behavior", () => {
    const listingA = createMockListing({ id: "a", title: "Listing Alpha", countryCode: "JO" });
    const listingB = createMockListing({ id: "b", title: "Listing Beta", countryCode: "JO" });

    useListingsStore.setState({ listings: [listingA, listingB] });
    useUIStore.setState({ browseCountryCode: "JO", searchQuery: "" });

    render(<SearchResultsScreen />);

    const countElement = screen.getByTestId("search-results-count");
    expect(countElement.textContent).toContain("2");
    expect(screen.getByText("Listing Alpha")).toBeDefined();
    expect(screen.getByText("Listing Beta")).toBeDefined();
  });
});
