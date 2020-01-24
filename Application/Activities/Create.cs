using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistance;
using static Application.Activities.Create;
using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {

            public Guid Id { get; set; }
            [Required]
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
    }
    
    public class CommandValidator : AbstractValidator<Command> 
    {
        // Add package FulentValidation before use
        // Almost the same thing as data annotions in model
        public CommandValidator() {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;
        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = new Activity {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                Date = request.Date,
                City = request.City,
                Venue = request.Venue
            };

            _context.Activities.Add(activity);
            // if result is greater than 0, success
            var success = await _context.SaveChangesAsync() > 0;

            if(success) {
                return Unit.Value;
            }
            else {
                throw new Exception("Could not save");
            }
        }
    }
}