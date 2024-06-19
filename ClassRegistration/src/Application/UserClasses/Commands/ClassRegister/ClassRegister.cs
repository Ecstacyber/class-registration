using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Users.Queries.GetUserInfo;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Commands.ClassRegister;

public record ClassRegisterCommand : IRequest<RegistrationResult>
{
    public int UserId { get; init; }
    public int ClassId { get; init; }
    public int RegistrationScheduleId { get; init; }
}

public class ClassRegisterCommandValidator : AbstractValidator<ClassRegisterCommand>
{
    public ClassRegisterCommandValidator()
    {
    }
}

public class ClassRegisterCommandHandler : IRequestHandler<ClassRegisterCommand, RegistrationResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    public ClassRegisterCommandHandler(IApplicationDbContext context, IUser user, IIdentityService identityService)
    {
        _context = context;
        _user = user;
        _identityService = identityService;
    }

    public async Task<RegistrationResult> Handle(ClassRegisterCommand request, CancellationToken cancellationToken)
    {
        var currentRegSchedule = await _context.RegistrationSchedules.FirstOrDefaultAsync(x => x.Id == request.RegistrationScheduleId, cancellationToken);
        if (currentRegSchedule != null)
        {
            if (currentRegSchedule.StartDate >= DateTime.Now || currentRegSchedule.EndDate <= DateTime.Now)
            {
                RegistrationRecord record = new RegistrationRecord
                {
                    Message = "Ngoài đợt đăng ký",
                    Result = "Thất bại",
                    RegistrationScheduleId = request.RegistrationScheduleId,
                    UserId = request.UserId,
                };
                _context.RegistrationRecords.Add(record);
                await _context.SaveChangesAsync(cancellationToken);
                return new RegistrationResult
                {
                    ClassCode = "null",
                    Result = "NotInRegistrationSchedule"
                };
            }
        }
        else
        {
            RegistrationRecord record = new RegistrationRecord
            {
                Message = "RegistrationSchedule is null",
                Result = "Thất bại",
                RegistrationScheduleId = request.RegistrationScheduleId,
                UserId = request.UserId,
                ClassId = request.ClassId
            };
            _context.RegistrationRecords.Add(record);
            await _context.SaveChangesAsync(cancellationToken);
            return new RegistrationResult
            {
                ClassCode = "null",
                Result = "RegistrationScheduleIsNull"
            };
        }
        
        var currentCount = await _context.UserClasses.CountAsync(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationScheduleId, cancellationToken);
        var currentClass = await _context.Classes.FirstOrDefaultAsync(x => x.Id == request.ClassId, cancellationToken);
        var entity = new UserClass();

        if (currentClass != null)
        {
            if (currentClass.Capacity > currentCount)
            {
                var currentCourse = await _context.Courses.Include(x => x.Prerequisites).FirstOrDefaultAsync(x => x.Id == currentClass.CourseId, cancellationToken);
                var user = await _context.Humans.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
                if (user == null)
                {
                    RegistrationRecord record = new RegistrationRecord
                    {
                        RequestType = "Đăng ký",
                        Message = "User is null",
                        Result = "Thất bại",
                        RegistrationScheduleId = request.RegistrationScheduleId,
                        UserId = request.UserId,
                        ClassId = request.ClassId
                    };
                    _context.RegistrationRecords.Add(record);
                    await _context.SaveChangesAsync(cancellationToken);
                    return new RegistrationResult
                    {
                        ClassCode = currentClass.ClassCode,
                        Result = "UserIsNull"
                    };
                }
                
                if (currentCourse != null)
                {
                    bool passedFlag = false;
                    List<string> dependencies = new List<string>();
                    if (currentCourse.Prerequisites.Count > 0)
                    {                        
                        foreach (var prerequisiteCourse in currentCourse.Prerequisites)
                        {
                            if (prerequisiteCourse.CourseId != currentCourse.Id)
                            {
                                passedFlag = true;
                                break;
                            }
                            if (prerequisiteCourse.RequirePassed == true)
                            {
                                var prerequisiteClasses = await _context.Classes.Where(x => x.CourseId == prerequisiteCourse.PrerequisiteCourseId).ToListAsync(cancellationToken);
                                if (prerequisiteClasses.Count > 0)
                                {                                   
                                    foreach (var prerequisiteClass in prerequisiteClasses)
                                    {
                                        var previousUserClasses = await _context.UserClasses.Include(x => x.User).Where(x => x.User == user && x.ClassId == prerequisiteClass.Id).ToListAsync(cancellationToken);                                        
                                        if (previousUserClasses.Any(x => x.Passed == true))
                                        {
                                            passedFlag = true;
                                            break;
                                        }
                                        else
                                        {
                                            passedFlag = false;
                                        }                                        
                                    }
                                    if (!passedFlag)
                                    {
                                        var c = _context.Courses.FirstOrDefault(x => x.Id == prerequisiteCourse.PrerequisiteCourseId);
                                        if (c != null)
                                        {
                                            dependencies.Add(c.CourseName);
                                        }
                                        
                                    }
                                }
                                else
                                {
                                    passedFlag = true;
                                }
                            }
                            else
                            {
                                passedFlag = true;
                            }
                        }
                    }
                    if (passedFlag == false)
                    {
                        RegistrationRecord record = new RegistrationRecord
                        {
                            RequestType = "Đăng ký",
                            Message = "Chưa qua môn tiên quyết",
                            Result = "Thất bại",
                            RegistrationScheduleId = request.RegistrationScheduleId,
                            UserId = request.UserId,
                            ClassId = request.ClassId,
                            Dependency = ""
                        };
                        foreach (var dependency in dependencies)
                        {
                            if (string.IsNullOrEmpty(record.Dependency))
                            {
                                record.Dependency += dependency;
                            }
                            else
                            {
                                record.Dependency = record.Dependency + ", " + dependency;
                            }                            
                        }
                        _context.RegistrationRecords.Add(record);
                        await _context.SaveChangesAsync(cancellationToken);
                        return new RegistrationResult
                        {
                            ClassCode = currentClass.ClassCode,
                            Result = "NotPassedPrerequisite"
                        };
                    }

                    var currentRegResult = await _context.UserClasses
                        .Include(x => x.User)
                        .Include(x => x.Class)
                        .Where(x => x.RegistrationScheduleId == request.RegistrationScheduleId && x.User == user)
                        .ToListAsync(cancellationToken);
                    if (currentRegResult.Count > 0)
                    {
                        if (currentRegResult.Any(x => x.RegistrationScheduleId == request.RegistrationScheduleId && x.ClassId == request.ClassId && x.User == user))
                        {
                            RegistrationRecord record = new RegistrationRecord
                            {
                                RequestType = "Đăng ký",
                                Message = "Đăng ký trùng",
                                Result = "Thất bại",
                                RegistrationScheduleId = request.RegistrationScheduleId,
                                UserId = request.UserId,
                                ClassId = request.ClassId
                            };
                            _context.RegistrationRecords.Add(record);
                            await _context.SaveChangesAsync(cancellationToken);
                            return new RegistrationResult
                            {
                                ClassCode = currentClass.ClassCode,
                                Result = "AlreadyRegistered"
                            };
                        }
                        if (currentRegResult.Any(x => x.RegistrationScheduleId == request.RegistrationScheduleId
                            && x.User == user
                            && x.Class != null
                            && x.Class.DayOfWeek == currentClass.DayOfWeek
                            && !((x.Class.StartPeriod > currentClass.StartPeriod && x.Class.StartPeriod > currentClass.EndPeriod)
                                || (x.Class.EndPeriod < currentClass.StartPeriod && x.Class.EndPeriod < currentClass.EndPeriod))
                            )
                        )
                        {
                            RegistrationRecord record = new RegistrationRecord
                            {
                                RequestType = "Đăng ký",
                                Message = "Trùng lịch học",
                                Result = "Thất bại",
                                RegistrationScheduleId = request.RegistrationScheduleId,
                                UserId = request.UserId,
                                ClassId = request.ClassId
                            };
                            _context.RegistrationRecords.Add(record);
                            await _context.SaveChangesAsync(cancellationToken);
                            return new RegistrationResult
                            {
                                ClassCode = currentClass.ClassCode,
                                Result = "ScheduleOccupied"
                            };
                        }
                        if (currentRegResult.Sum(x => x.Class.Credit) + currentClass.Credit > currentRegSchedule.MaximumCredit)
                        {
                            RegistrationRecord record = new RegistrationRecord
                            {
                                RequestType = "Đăng ký",
                                Message = "Quá giới hạn tín chỉ",
                                Result = "Thất bại",
                                RegistrationScheduleId = request.RegistrationScheduleId,
                                UserId = request.UserId,
                                ClassId = request.ClassId
                            };
                            _context.RegistrationRecords.Add(record);
                            await _context.SaveChangesAsync(cancellationToken);
                            return new RegistrationResult
                            {
                                ClassCode = currentClass.ClassCode,
                                Result = "MaximumCreditReached"
                            };
                        }
                    }
                    entity.User = user;
                    entity.ClassId = request.ClassId;
                    entity.RegistrationScheduleId = request.RegistrationScheduleId;
                    entity.Passed = false;
                    RegistrationRecord srecord = new RegistrationRecord
                    {
                        RequestType = "Đăng ký",
                        Message = "",
                        Result = "Thành công",
                        RegistrationScheduleId = request.RegistrationScheduleId,
                        UserId = request.UserId,
                        ClassId = request.ClassId
                    };
                    _context.RegistrationRecords.Add(srecord);
                    _context.UserClasses.Add(entity);
                    await _context.SaveChangesAsync(cancellationToken);
                    return new RegistrationResult
                    {
                        ClassCode = currentClass.ClassCode,
                        Result = "Success"
                    };
                }
                else
                {
                    RegistrationRecord record = new RegistrationRecord
                    {
                        RequestType = "Đăng ký",
                        Message = "Course is null",
                        Result = "Thất bại",
                        RegistrationScheduleId = request.RegistrationScheduleId,
                        UserId = request.UserId,
                        ClassId = request.ClassId
                    };
                    _context.RegistrationRecords.Add(record);
                    return new RegistrationResult
                    {
                        ClassCode = currentClass.ClassCode,
                        Result = "CourseIsNull"
                    };
                }
            }
            else
            {
                RegistrationRecord record = new RegistrationRecord
                {
                    RequestType = "Đăng ký",
                    Message = "Lớp đã đầy",
                    Result = "Thất bại",
                    RegistrationScheduleId = request.RegistrationScheduleId,
                    UserId = request.UserId,
                    ClassId = request.ClassId
                };
                _context.RegistrationRecords.Add(record);
                await _context.SaveChangesAsync(cancellationToken);
                return new RegistrationResult
                {
                    ClassCode = currentClass.ClassCode,
                    Result = "ClassIsFull"
                };
            }
        }

        RegistrationRecord frecord = new RegistrationRecord
        {
            RequestType = "Đăng ký",
            Message = "Class is null",
            Result = "Thất bại",
            RegistrationScheduleId = request.RegistrationScheduleId,
            UserId = request.UserId,
            ClassId = request.ClassId
        };
        _context.RegistrationRecords.Add(frecord);
        await _context.SaveChangesAsync(cancellationToken);
        return new RegistrationResult
        {
            ClassCode = "null",
            Result = "ClassIsNull"
        };
    }
}
