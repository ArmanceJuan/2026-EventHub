import jenkins.model.Jenkins
import hudson.security.FullControlOnceLoggedInAuthorizationStrategy
import hudson.security.HudsonPrivateSecurityRealm

def instance = Jenkins.get()

String adminUser = System.getenv("JENKINS_ADMIN_ID") ?: "admin"
String adminPassword = System.getenv("JENKINS_ADMIN_PASSWORD") ?: "admin123"

def securityRealm = new HudsonPrivateSecurityRealm(false)

if (securityRealm.getUser(adminUser) == null) {
  securityRealm.createAccount(adminUser, adminPassword)
}

instance.setSecurityRealm(securityRealm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
instance.setAuthorizationStrategy(strategy)

instance.save()
