import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldCenter = {
    id : Nat;
    name : Text;
    location : Text;
  };

  type OldMonthlyDashboard = {
    month : Nat;
    year : Nat;
    revenue : Float;
    target : Float;
    coachSalaries : Float;
    center : OldCenter;
  };

  type OldActor = {
    dashboards : Map.Map<Nat, OldMonthlyDashboard>;
  };

  type Coach = {
    name : Text;
    salaries : Float;
    center : Text;
  };

  type NewMonthlyDashboard = {
    month : Nat;
    year : Nat;
    revenue : Float;
    target : Float;
    coaches : [Coach];
    centerName : Text;
  };

  type NewActor = {
    dashboards : Map.Map<Nat, NewMonthlyDashboard>;
  };

  public func run(old : OldActor) : NewActor {
    let newDashboards = old.dashboards.map<Nat, OldMonthlyDashboard, NewMonthlyDashboard>(
      func(_id, oldDashboard) {
        {
          oldDashboard with
          coaches = [];
          centerName = oldDashboard.center.name;
        };
      }
    );
    { dashboards = newDashboards };
  };
};
