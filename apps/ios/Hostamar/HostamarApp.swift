import SwiftUI

@main
struct HostamarApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Hostamar Enterprise")
                    .font(.largeTitle)
                    .padding()
                
                NavigationLink(destination: Text("DGP Assets")) {
                    Text("View Assets")
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(10)
                }
            }
            .navigationTitle("Dashboard")
        }
    }
}
