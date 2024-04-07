using System.Data.SqlTypes;

namespace ClassRegistration.Server.Models
{
    public class TuitionFeeInfo
    {
        public required string Id { get; set; }
        public required SqlMoney TotalFee { get; set; }
        public required string UserId { get; set; }
        public ICollection<RegistrationInfo> RegistrationInfoId { get; set; } = [];
    }
}
