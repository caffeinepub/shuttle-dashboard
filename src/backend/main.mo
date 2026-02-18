import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Types
  type Month = Nat; // 1 = January, 12 = December

  type Coach = {
    name : Text;
    salaries : Float;
    center : Text;
  };

  type MonthlyDashboard = {
    month : Month;
    year : Nat;
    revenue : Float;
    target : Float;
    coaches : [Coach];
    centerName : Text;
  };

  // Compare MonthlyDashboard records by year and month
  module MonthlyDashboard {
    public func compare(a : MonthlyDashboard, b : MonthlyDashboard) : Order.Order {
      switch (Nat.compare(a.year, b.year)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) {
          Nat.compare(a.month, b.month);
        };
      };
    };
  };

  // Storage for dashboard records
  let dashboards = Map.empty<Nat, MonthlyDashboard>();

  // Add or update a monthly dashboard record
  public shared ({ caller }) func upsertDashboard(id : Nat, dashboard : MonthlyDashboard) : async () {
    dashboards.add(id, dashboard);
  };

  // Get a single dashboard record
  public query ({ caller }) func getDashboard(id : Nat) : async MonthlyDashboard {
    switch (dashboards.get(id)) {
      case (null) { Runtime.trap("Dashboard not found") };
      case (?dashboard) { dashboard };
    };
  };

  // Get all dashboard records for a specific year (sorted by month)
  public query ({ caller }) func getDashboardsByYear(year : Nat) : async [MonthlyDashboard] {
    dashboards.values().toArray().filter(func(d) { d.year == year }).sort();
  };

  // Delete a dashboard record
  public shared ({ caller }) func deleteDashboard(id : Nat) : async () {
    if (dashboards.containsKey(id)) {
      dashboards.remove(id);
    } else {
      Runtime.trap("Dashboard not found");
    };
  };

  // Get all dashboards sorted by year and month
  public query ({ caller }) func getAllDashboards() : async [MonthlyDashboard] {
    dashboards.values().toArray().sort();
  };
};
