using GraduationProject.App.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GraduationProject.App.FilterAttributes
{
    public class RequireLoginAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string user = context.HttpContext.Session.GetString("SessionUser");


            if (string.IsNullOrEmpty(user))
            {
                context.Result = new RedirectToActionResult("Login" , "Home", null);
            }
        }
    }
}
